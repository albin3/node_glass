// model.js coupon
var config = require('../../config');
var mongojs = require('mongojs');

var db = mongojs(config.dbinfo.dbname);
var dbcoupon = db.collection('coupon');
var ObjectID = require('mongodb').ObjectID;

// 新建优惠券
exports.newcoupon = function (coupon, callback) {
  dbcoupon.insert(coupon, function(err, doc){
    if (err) {
      return callback({ret: 2});                    // RETURN: 数据库插入出错
    }
    doc._id = doc._id.toString();
    return callback({ret: 1, val: doc});            // RETURN: 插入成功
  });
};

// 查询所有优惠券
exports.allcoupon = function (callback) {
  dbcoupon.find({}, function(err,docs){
    if (err) {
      callback({ret: 2});                           // RETURN: 数据库出错
    }
    callback({ret: 1, val: docs});                  // RETURN: 返回成功
  });
};

// 删除指定优惠券
exports.delcoupon = function (coupon, callback) {
  dbcoupon.remove({_id: new ObjectID(coupon._id)}, function(err){
    if (err) {
      callback({ret: 2});                           // RETURN: 数据库出错
    }
    callback({ret: 1});                             // RETURN: 返回成功
  });
};

// 删除所有
exports.delall = function (callback) {
  dbcoupon.remove({}, function(err){
    if (err) {
      callback({ret: 2});                           // RETURN: 数据库出错
    }
    callback({ret: 1});                             // RETURN: 返回成功
  });
};
