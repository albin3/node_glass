// model.js sharelink
var config = require('../../config');
var mongojs = require('mongojs');
var db = mongojs(config.dbinfo.dbname);
var ObjectID   = require('mongodb').ObjectID;
var db_appuser = db.collection('appuser');

// 链接分享次数
exports.sharelink = function(req, callback){
  var msgs = req.params;
  db_appuser.update({_id: new ObjectID(msgs.userid)}, {$inc: {sharenum: 1}}, function(err, doc){
    if (err) {
      return callback({ret: 2});
    }
    return callback({ret: 1});
  });
};

// 链接点击次数
exports.sharepage = function(req, callback) {
  var msgs = req.params;
  db_appuser.update({_id: new ObjectID(msgs.userid)}, {$inc: {clicknum: 1}}, function(err, doc){
    ;       // 光增加，不做处理
  });
  return callback({ret: 1, val: msgs});
}

