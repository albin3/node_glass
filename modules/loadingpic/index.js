// 添加广告图片，路由
var view = require('./view');

exports.register = function(app){
  app.get("/appbg/loudingpic/:lan/:size", view.index);
  app.post("/appbg/loudingpic/new/:lan", view.newpic);
  app.post("/appbg/loudingpic/del", view.delpic);
};

