// model.js sharelink
var config = require('../../config');
var mongojs = require('mongojs');
var db = mongojs(config.dbinfo.dbname);
var ObjectID   = require('mongodb').ObjectID;
var db_appuser = db.collection('appuser');
var db_news    = db.collection('news');
var db_prod    = db.collection('product');

// 链接分享次数
exports.sharelink = function(req, callback){
  var msgs = req.params;
  if (msgs.userid.length < 24) {
    return callback({ret: 3});
  }
  db_appuser.update({_id: new ObjectID(msgs.userid)}, {$inc: {sharenum: 1}}, function(err, doc){
    if (err) {
      return callback({ret: 2});
    }
    return callback({ret: 1});
  });
};

// 链接点击新闻次数
exports.sharenews = function(req, callback) {
  var msgs = req.params;
  if (msgs.userid.length === 24) {
    db_appuser.update({_id: new ObjectID(msgs.userid)}, {$inc: {clicknum: 1}}, function(err, doc){
    });
  }
  if (msgs.objid.length === 24) {
    db_news.findOne({_id: new ObjectID(msgs.objid)}, function(err, doc){
      if (err || !doc) {
        return callback({ret: 2});                 // RETURN: 没查到数据
      } else {
        return callback({ret: 1, val: doc});       // RETURN: 查到数据并返回
      }
    });
  } else {
    return callback({ret: 2});                     // RETURN: 没查到数据
  }
}

// 链接点击产品次数
exports.shareprod = function(req, callback) {
  var msgs = req.params;
  if (msgs.userid.length === 24) {
    db_appuser.update({_id: new ObjectID(msgs.userid)}, {$inc: {clicknum: 1}}, function(err, doc){
    });
  }
  if (msgs.objid.length === 24) {
    db_prod.findOne({_id: new ObjectID(msgs.objid)}, function(err, doc){
      if (err || !doc) {
        return callback({ret: 2});                 // RETURN: 没查到数据
      } else {
        //
        if (!doc.image) {
          doc.image = [];
        }
        for (var i=0; i<doc.image.length; i++) {
          doc.image[i].url = "/img/product/"+doc.image[i].url+doc._id.toString()+".jpg";
        }
        return callback({ret: 1, val: doc});       // RETURN: 查到数据并返回
      }
    });
  } else {
    return callback({ret: 2});                     // RETURN: 没查到数据
  }
}

