// news 模块
var view = require('./view');

exports.register = function (app) {
  app.get('/appbg/brand/:lan', view.brand);     
  app.get('/appbg/brand/addbrand/:lan', view.getaddbrand);
  app.post('/appbg/brand/addbrand/:lan', view.addbrand);
  app.post('/appbg/brand/delall/:lan', view.delall);
  app.post('/appbg/brand/del', view.del);
};

