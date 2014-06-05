// 添加广告图片，路由
var view = require('./view');

exports.register = function(app){
  app.get("/appbg/loadingpic/:lan", view.index);
  app.post("/appbg/loadingpic/new/:lan", view.newpic);
  // app.post("/appbg/loadingpic/del", view.delpic);
};

