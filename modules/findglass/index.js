// 寻找黄眼镜，路由
var view = require('./view');

exports.register = function(app){
  app.get("/appbg/findglass/:lan/:size", view.index);
  app.post("/appbg/findglass/new/:lan", view.newpic);
  app.post("/appbg/findglass/del", view.delpic);
};

