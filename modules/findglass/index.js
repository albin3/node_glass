// 寻找黄眼镜，路由
var view = require('./view');

exports.register = function(app){
  app.get("/appbg/findglass", view.index);
  app.post("/appbg/findglass", view.newpic);
  app.post("/appbg/findglass/del", view.delpic);
};
