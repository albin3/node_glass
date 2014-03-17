// coupon 模块
var view = require('./view');

exports.register = function (app) {
  app.get('/appbg/coupon', view.coupon);
  app.post('/appbg/coupon/new', view.newcoupon);
  app.post('/appbg/coupon/del', view.delcoupon);
  app.post('/appbg/coupon/delall', view.delall);
};
