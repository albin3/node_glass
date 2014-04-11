// news model
var config = require("../../config"); // 为了获取到路径
var qureystring = require("querystring");
var fs = require("fs");
var fileExists = require("path").exists;

var async = require("async");

var mongojs = require('mongojs');
var db = mongojs(config.dbinfo.dbname);
var dbnews = db.collection('news');
var ObjectID = require('mongodb').ObjectID;

// 获取到某条新闻的全部信息
exports.findOneNews = function (id, callback) {
  dbnews.findOne({_id: new ObjectID(id)}, function (err, doc) {
    callback(err, doc);
  });
};

// 获取到所有新闻信息
exports.allnews = function (callback) {
  dbnews.find({}, function (err, docs) {
    callback(err, docs);
  });
};

// 添加新闻，返回添加成功的对象
// copy /img/news/default.jpg to /img/news/<_id>.jpg作为新闻的首图
exports.addnews =  function (news, callback) {
  news.focus = false;     // 是否设置为焦点图
  dbnews.insert(news, function (err, doc) {
    if (doc) {
      var defaultimg = config.appPath() + "/static/img/default.jpg";
      var newsfirstimg = config.appPath() + "/static/img/news/" + doc._id.toString() + ".jpg";

      // 复制default.jpg
      fs.readFile(defaultimg, function (err, data) {
        fs.writeFile(newsfirstimg, data, function(err) {});
      });
    }
    callback(err, doc);
  });
};

// 删除以id开头的所有图片
function deletePicturesOfNews(newsid) {
  var imgpath = config.appPath() + "/static/img/news/" + newsid;
  for (var i = 0; i < 10; i++) {
    try {
      fs.unlinkSync(imgpath+i+".jpg");
    } catch (e){
    }
  }
};

// 删除新闻
exports.delnews =  function (news, callback) {
  dbnews.remove({ _id: new ObjectID(news.id) }, function (err) {
    
    // 删除新闻首图
    var newsfirstimg = config.appPath() + "/static/img/news/" + news.id + ".jpg";
    try {
      fs.unlinkSync(newsfirstimg);
      deletePicturesOfNews(news.id);
    } catch (e) {
    }

    callback(err);
  });
};

// 递归删除文件夹
function deleteFolderRecursive(path) {
  var files = [];
  if( fs.existsSync(path) ) {
    files = fs.readdirSync(path);
    files.forEach(function(file,index){
      var curPath = path + "/" + file;
      if(fs.statSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursive(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
};

// 删除所有新闻
exports.delall =  function (callback) {
  dbnews.remove(function(err) {
    if(err) {
      return callback(err);
    }
    deleteFolderRecursive(config.appPath() + "/static/img/news");  // 递归删除文件夹
    fs.mkdir(config.appPath() + "/static/img/news", function(err){
      return callback(err);
    });
  });
};

// 限制上传的图片的大小，阈值可以在config中设置
function judge_size(size) {
  return size > 0 && size < config.pic_size;
}

// 更新新闻内容时，需要用到面向过程的逻辑：
// 更新新闻内容
exports.updatenews = function (req, callback) {
  var files = req.files;
  var texts = req.body;
  var newsid = texts["_id"];
  delete texts["_id"];
  var query = {_id: new ObjectID(newsid)};

  dbnews.findOne(query, function (err, doc) {
    doc.title = texts["news-title"];              // 更新标题
    delete texts["news-title"];
    doc.summary = texts["news-summary"];          // 更新导语
    delete texts["news-summary"];
    doc.firpicdes = texts["news-fir-pic-des"];    // 更新首图描述
    delete texts["news-fir-pic-des"];
    if (files["first-pic"].size > 0){             // 更新首图
      if (judge_size(files["first-pic"].size)) { 
        fs.readFile(files["first-pic"].path, function (err, data) {
          var path = config.appPath() + "/static/img/news/" + newsid + ".jpg";
          fs.writeFile(path, data, function(err){
          });
        });
      }
    }

    var old_details = doc.details;                // 更新新闻中的元素
    var new_details = new Array();
    var path = config.appPath() + "/static/img/news/" + newsid;

    // **为了完成新闻内容更新的功能，需要用到同步的方式进行
    // ******所有的项目调用同一个函数，用到了async.apply，放在数组里，再调用async.series
    var funcArr = [];
    for (text in texts){
      funcArr.push(async.apply(function(text, callback){
        var item = {};
        if (text.toString().indexOf("pic") > 0){
          item.type = 2;
          item.content = "/img/news/" + newsid + new_details.length + ".jpg";
          item.des = texts[text];
          text = text.replace("news-pic-","");
          if (files["upload"+text].size > 0) {                       // 有新上传的图片
            fs.rename(files["upload"+text].path, path+new_details.length+".jpg",function(err){
              new_details.push(item);
              callback();
            });
          }else if (old_details[text] && old_details[text].type === 2){   // 原本是图片的形式时，需要把图片重命名
            fs.rename(path+text+".jpg", path+new_details.length+".jpg", function(err){
              new_details.push(item);
              callback();
            });
          } else {
            new_details.push(item);
            callback();
          }
        } else {
          console.log("this is a text.");
          item.type = 1;
          item.content = texts[text];
          item.des = "";
          new_details.push(item);
          callback();
        }
      },text));
    }
    async.series(
        funcArr
        ,function(err){
      doc.details = new_details;
      console.log(new_details);
      dbnews.update({_id: new ObjectID(newsid)}, doc, function(err, data){
        console.log("done");
        callback(err);
      });
    });
  });
};

// 改变新闻的状态
exports.changestate =  function (req, callback) {
  var id = req.params.newsid;
  var state = req.body.focus === "true" ? true : false;
  dbnews.update({_id: new ObjectID(id)}, {
    $set: { focus: state }
  },function(err, doc) {
    if(err) {
      return callback(err);
    }
    if (state) {
      return callback(err, {state: "焦点图"});
    }
    return callback(err, {state: "非焦点"});
  });
};
