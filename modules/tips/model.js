// model.js tips
var config = require('../../config');
var mongojs = require('mongojs');

var db = mongojs(config.dbinfo.dbname);
var dbtips = db.collection('tips');
var ObjectID = require('mongodb').ObjectID;

// 新建tips
exports.newtips = function (req, callback) {
  var tips = req.body;
  tips.lan = req.params.lan;
  dbtips.insert(tips, function(err, doc){
    if (err) {
      return callback({ret: 2});                    // RETURN: 数据库插入出错
    }
    doc._id = doc._id.toString();
    return callback({ret: 1, val: doc});            // RETURN: 插入成功
  });
};

// 查询所有优惠券
exports.alltips = function (req, callback) {
  dbtips.find({lan : req.params.lan}, function(err,docs){
    if (err) {
      callback({ret: 2});                           // RETURN: 数据库出错
    }
    callback({ret: 1, val: docs});                  // RETURN: 返回成功
  });
};

// 删除指定优惠券
exports.deltips = function (tips, callback) {
  dbtips.remove({_id: new ObjectID(tips._id)}, function(err){
    if (err) {
      callback({ret: 2});                           // RETURN: 数据库出错
    }
    callback({ret: 1});                             // RETURN: 返回成功
  });
};

// 删除所有
exports.delall = function (req, callback) {
  dbtips.remove({lan : req.params.lan}, function(err){
    if (err) {
      callback({ret: 2});                           // RETURN: 数据库出错
    }
    callback({ret: 1});                             // RETURN: 返回成功
  });
};
