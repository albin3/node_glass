// model.js appversion
var config = require('../../config');
var mongojs = require('mongojs');
var fs = require('fs');

var db = mongojs(config.dbinfo.dbname);
var dbversion = db.collection('appleversion');
var ObjectID = require('mongodb').ObjectID;

// 返回当前版本
exports.currentVersion = function(req, callback) {
  dbversion.find({lan: req.params.lan}).sort({time: -1}).limit(1, function(err, docs) {
    if (err || docs.length === 0) {
      return callback({ret: 2});                 // 数据库中没有版本信息
    }
    return callback({ret: 1, doc: docs[0]});
  });
};

// 更新版本
exports.versionupdate = function(req, callback) {
  var num    = req.body.num    || "1.0.0";
  var name   = req.body.name   || "First Version";
  var dlurl  = req.body.dlurl  || "Download url";
  var scurl  = req.body.scurl  || "Score url";
  var detail = req.body.detail || "Description";
  dbversion.findOne({lan: req.params.lan}, function(err, version){
    if (version === null) {
      version = {};
    }
    version.number      = num;
    version.name        = name;
    version.detail      = detail;
    version.downloadurl = dlurl;
    version.scoreurl    = scurl;
    version.time        = new Date();
    version.lan         = req.params.lan;
    dbversion.update({lan: req.params.lan}, version, {upsert: true}, function(err) {
      if (err) {
        return callback({ret: 2});                          // 数据库更新错误
      }
      return callback({ret: 1, val: version});              // 更新成功
    });
  });
};

