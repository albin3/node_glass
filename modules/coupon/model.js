// model.js coupon
var config = require('../../config');
var mongojs = require('mongojs');

var db = mongojs(config.dbinfo.dbname);
var dbcoupon = db.collection('coupon');
var ObjectID = require('mongodb').ObjectID;

// 新建优惠券
exports.newcoupon = function (req, callback) {
  var coupon = req.body;
  coupon.lan = req.params.lan;
  coupon.remain      = parseInt(coupon.remain);
  coupon.possibility = parseFloat(coupon.possibility);
  coupon.expiress    = new Date(new Date(coupon.expiress).getTime() + 8*3600*1000);
  coupon.expirese    = new Date(new Date(coupon.expirese).getTime() + 8*3600*1000);
  coupon.type        = parseInt(coupon.type);
  coupon.dt          = new Date().getTime();
  dbcoupon.insert(coupon, function(err, doc){
    if (err) {
      return callback({ret: 2});                    // RETURN: 数据库插入出错
    }
    doc._id = doc._id.toString();
    return callback({ret: 1, val: doc});            // RETURN: 插入成功
  });
};

// 查询所有优惠券
exports.allcoupon = function (req, callback) {
  dbcoupon.find({lan: req.params.lan, type: 1}, function(err,coupon1){
    if (err) {
      return callback({ret: 2});                                                           // RETURN: 数据库出错
    }
    dbcoupon.find({lan: req.params.lan, type: 2}, function(err,coupon2){
      if (err) { 
        return callback({ret: 2});                                                         // RETURN: 数据库出错
      }
      return callback({ret: 1, val: {coupon1: coupon1, coupon2: coupon2}});                // RETURN: 返回成功
    });
  });
};

// 删除指定优惠券
exports.delcoupon = function (coupon, callback) {
  dbcoupon.remove({_id: new ObjectID(coupon._id)}, function(err){
    if (err) {
      return callback({ret: 2});                                   // RETURN: 数据库出错
    }
    return callback({ret: 1});                                     // RETURN: 返回成功
  });
};

// 删除所有
exports.delall = function (req, callback) {
  dbcoupon.remove({lan: req.params.lan, type: parseInt(req.body.type)}, function(err){
    if (err) {
      return callback({ret: 2});                                    // RETURN: 数据库出错
    }
    return callback({ret: 1, val: parseInt(req.body.type)});        // RETURN: 返回成功
  });
};

