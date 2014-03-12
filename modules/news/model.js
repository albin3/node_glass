// news model
var config = require("../../config"); // 为了获取到路径
var qureystring = require("querystring");
var fs = require("fs");

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
// 上传文件
exports.updatepic = function(req, callback)
{
  var newPath = config.appPath() + "/static/img/" + req.params.picnum + ".jpg";

  fs.readFile(req.files.upload.path, function (err, data) {
    fs.writeFile(newPath, data, function (err) {
      fs.unlinkSync(req.files.upload.path);
      callback(err);
    });
  });
}

// 获取到所有新闻信息
exports.allnews = function (callback) {
  dbnews.find({}, function (err, docs) {
    callback(err, docs);
  });
};

// 添加新闻，返回添加成功的对象
// copy /img/news/default.jpg to /img/news/<_id>.jpg作为新闻的首图
exports.addnews =  function (news, callback) {
  dbnews.insert(news, function (err, doc) {
    if (doc) {
      var defaultimg = config.appPath() + "/static/img/news/default.jpg";
      var newsfirstimg = config.appPath() + "/static/img/news/" + doc._id.toString() + ".jpg";

      // 复制default.jpg
      fs.readFile(defaultimg, function (err, data) {
        fs.writeFile(newsfirstimg, data, function(err) {});
      });
    }
    callback(err, doc);
  });
};

// 删除新闻
exports.delnews =  function (news, callback) {
  dbnews.remove({ _id: new ObjectID(news.id) }, function (err) {
    
    // 删除新闻首图
    var newsfirstimg = config.appPath() + "/static/img/news/" + news.id + ".jpg";
    try {
      fs.unlinkSync(newsfirstimg);
    } catch (e) {
    }

    callback(err);
  });
};

// 删除所有新闻
exports.delall =  function (callback) {
  dbnews.remove(function(err) {
    if(err) {
      return callback(err);
    }
    fs.rmdir(config.appPath() + "/static/img/news", function(err){
      if (err) {
        return callback(err);
      }
      fs.mkdir(config.appPath() + "/static/img/news", function(err){
        return callback(err);
      });
    });
  });
};

// 限制上传的图片的大小，阈值可以在config中设置
function judge_size(size) {
  return size > 0 && size < config.pic_size;
}

// 更换新闻首图
exports.chpic = function (req, callback) {

  if (judge_size(req.files.upload.size)) {
    var newPath = config.appPath() + "/static/img/news/" + req.params.newsid + ".jpg";
    fs.readFile(req.files.upload.path, function (err, data) {
      fs.writeFile(newPath, data, function (err) {
        fs.unlinkSync(req.files.upload.path);
        callback(err);
      });
    });
  } else {
    callback("file size error"); // 图片大小不符合限制
  }
};

// 添加新闻图片
exports.addpic = function (req, callback) {

  if (judge_size(req.files.upload.size)) {
    var id = req.params.newsid;
    dbnews.findOne({_id: new ObjectID(id)}, function(err, doc) {
      if (!doc.imgs) {
        doc.imgs = new Array();
      }
      var numImg = doc.imgs.length;
      // 将新的图片存储在文件中
      var newPath = config.appPath() + "/static/img/news/" + req.params.newsid + numImg + ".jpg";
      console.log(newPath);
      fs.readFile(req.files.upload.path, function (err, data) {
        if (err) {callback(err);}
        fs.writeFile(newPath, data, function (err) {
          if (err) {callback(err);}
          fs.unlinkSync(req.files.upload.path);
          doc.imgs.push({
            url    : "/img/news/" + req.params.newsid + numImg + ".jpg",
            enable : true
          });
          dbnews.update({_id: new ObjectID(id)}, doc, function (err, docs) {
            callback(err, doc);
          });
        });
      });
    });
  } else {
    callback("file size error"); // 图片大小不符合限制
  }
};
