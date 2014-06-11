// brand model
var config = require("../../config"); // 为了获取到路径
var qureystring = require("querystring");
var fs = require("fs");
var fileExists = require("path").exists;
var mongojs = require('mongojs');
var db = mongojs(config.dbinfo.dbname);
var dbbrand = db.collection('brand');
var ObjectID = require('mongodb').ObjectID;





// 查询所有品牌
exports.allbrand = function (req, callback) {
  dbbrand.find({lan : req.params.lan}).sort({summary: 1, _id: 1}, function(err,docs){
    if (err) {
      callback({ret: 2});                           // RETURN: 数据库出错
    }
    callback({ret: 1, val: docs});                  // RETURN: 返回成功
  });
};

// 添加品牌，返回添加成功的对象
exports.addbrand =  function (req, callback) {
  var files = req.files;
  var brand = req.body;
  if (isNaN(parseFloat(brand.summary))) {
    brand.summary = 10;
  } else {
    brand.summary = parseFloat(brand.summary);
  }
  var language = req.params.lan;
  brand.lan = language;
  dbbrand.insert(brand, function (err, doc) {
    if (doc) {
      if (files["picture"].size > 0){ 
        if (judge_size(files["picture"].size)) { 
          fs.readFile(files["picture"].path, function (err, data) {
            var path = config.appPath() + "/static/img/brand/" + doc._id + ".jpg";
            fs.writeFile(path, data, function(err){
            });
          });
        }
      }
      return callback(doc);
    }
  });
};

// 删除以id开头的所有图片
function deletePicturesOfNews(brandid) {
  var imgpath = config.appPath() + "/static/img/brand/" + brandid;
  for (var i = 0; i < 10; i++) {
    try {
      fs.unlinkSync(imgpath+i+".jpg");
    } catch (e){
    }
  }
};


// 删除品牌
exports.del =  function (brand, callback) {
  dbbrand.remove({ _id: new ObjectID(brand.id) }, function (err) {
    
    var pic = config.appPath() + "/static/img/brand/" + brand.id + ".jpg";
    try {
      fs.unlinkSync(pic);
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

// 删除所有品牌
exports.delall =  function (req, callback) {
  dbbrand.remove({lan: req.params.lan}, function(err) {
    if(err) {
      return callback(err);
    }
    deleteFolderRecursive(config.appPath() + "/static/img/slide");  // 递归删除文件夹
    fs.mkdir(config.appPath() + "/static/img/slide", function(err){
      return callback(err);
    });
  });
};

// 限制上传的图片的大小，阈值可以在config中设置
function judge_size(size) {
  return size > 0 && size < config.pic_size;
}

