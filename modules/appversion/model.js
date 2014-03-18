// model.js appversion
var config = require('../../config');
var mongojs = require('mongojs');
var fs = require('fs');

var db = mongojs(config.dbinfo.dbname);
var dbversion = db.collection('appversion');
var ObjectID = require('mongodb').ObjectID;

// 返回当前版本
exports.currentVersion = function(callback) {
  dbversion.find({}).sort({time: -1}).limit(1, function(err, docs) {
    if (err || docs.length === 0) {
      return callback({ret: 2});                 // 数据库中没有版本信息
    }
    return callback({ret: 1, doc: docs[0]});
  });
};

// 更新版本
exports.versionupdate = function(req, callback) {
  dbversion.findOne({}, function(err, version){
    if (version === null) {
      version = {};
    }
    version.number = req.body["version-number"];
    version.name   = req.body["version-name"];
    version.detail = req.body["version-detail"];
    version.time   = new Date();
    version.url    = "/apk/Essilor.apk";
    if (req.files["apkfile"].size === 0) {
      return callback({ret: 3});                 // 未上传文件
    }
    fs.renameSync(req.files["apkfile"].path, config.appPath() + "/apk/Essillor.apk")
    dbversion.update({_id: version._id}, version, function(err) {
      if (err) {
        return callback({ret: 2});               // 数据库更新错误
      }
      return callback({ret: 1});                 // 更新成功
    });
  });
};
