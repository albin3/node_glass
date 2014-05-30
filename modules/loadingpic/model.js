// 广告图片 model.js
var config  = require('../../config');
var mongojs = require('mongojs');
var fs      = require('fs');
var plist   = require('plist');

var db = mongojs(config.dbinfo.dbname);
var dbloadingpic = db.collection('loadingpic');
var ObjectID = require('mongodb').ObjectID;

exports.allpics = function(req, callback) {
  dbloadingpic.find({ lan: req.params.lan }).sort({dt: -1}, function(err, docs){
    if (err)  
      docs = new Array();
    console.log(docs);
    return callback({ret: 1, docs: docs});
  });
};

exports.newpic = function(req, callback) {
  var lan  = req.params.lan;
  var size = req.body["pic-size"];
  var width  = 0;
  var height = 0;
  switch(size) {
  case '1': width = 320; height = 480; break;
  case '2': width = 480; height = 800; break;
  case '3': width = 640; height = 960; break;
  case '4': width = 640; height = 1136;break;
  case '5': width = 720; height = 1280;break;
  case '6': width = 1080;height = 1920;break;
  }
  if (req.files["upload"].size > 0)
    fs.renameSync(req.files["upload"].path, config.appPath()+"/static/img/loadingpic/"+size+".jpg");
  dbloadingpic.update({size: size, url: "/img/loadingpic/"+size+".jpg", lan: lan}, {$set: {dt: new Date().getTime(), width: width, height: height}}, {upsert: true}, function(err, doc) {
    if (!err) {
      return callback({ret: 1});
    }
    return callback({ret: 2});
  });
};

exports.delpic = function(req, callback) {
  return callback({ret: 1});  // 不允许删除
};
