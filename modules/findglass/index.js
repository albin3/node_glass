// 寻找黄眼镜，路由
var view = require('./view');

exports.register = function(app){
  app.get("/appbg/findglass/:lan", view.index);
  app.post("/appbg/findglass/:lan", view.newpic);
  app.post("/appbg/findglass/del", view.delpic);
};
