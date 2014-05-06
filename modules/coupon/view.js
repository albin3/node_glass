// view.js coupon
var model = require('./model');

// 优惠券管理主页
exports.coupon = function (req, res) {
  model.allcoupon(req, function(ret){
    res.render('coupon/index', {Title: "Coupon Management", language: req.params.lan, nomalcoupons: ret.val.coupon1, specialcoupons: ret.val.coupon2});
  });
};

// 新增优惠券
exports.newcoupon = function (req, res) {
  model.newcoupon(req, function(ret) {
    res.end(JSON.stringify(ret));
  });
};

// 删除优惠券
exports.delcoupon = function (req, res) {
  model.delcoupon(req.body, function(ret) {
    res.end(JSON.stringify(ret));
  });
};

// 删除所有
exports.delall = function (req, res) {
  model.delall (req, function(ret) {
    res.end(JSON.stringify(ret));
  });
};
