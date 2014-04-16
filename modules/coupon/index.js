// coupon 模块
var view = require('./view');

exports.register = function (app) {
  app.get('/appbg/coupon/:lan', view.coupon);
  app.post('/appbg/coupon/new/:lan', view.newcoupon);
  app.post('/appbg/coupon/del', view.delcoupon);
  app.post('/appbg/coupon/delall/:lan', view.delall);
};
