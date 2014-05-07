// 寻找黄眼镜 view.js
var model = require('./model');

// 黄眼镜游戏主页
exports.index = function (req, res) {
  req.body.size = req.params.size;
  model.allpics(req, function(data) {
    res.render("findglass/index", {Title: "Find Glass", language: req.params.lan, objs: data.docs, size: data.size});
  });
};

// 上传新的图片
exports.newpic = function(req, res) {
  model.newpic(req, function(data){
    if (data.ret !== 1) 
      res.redirect("/appbg/findglass/"+req.params.lan+"/1");
    else
      res.redirect("/appbg/findglass/"+req.params.lan+"/"+data.size);
  });
};

// 删除图片
exports.delpic = function(req, res) {
  model.delpic(req.body, function(ret){
    res.end(JSON.stringify(ret));
  });
};
