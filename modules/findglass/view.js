// 寻找黄眼镜 view.js
var model = require('./model');

// 黄眼镜游戏主页
exports.index = function (req, res) {
  model.allpics(function(docs) {
    res.render("findglass/index", {Title: "寻找黄眼镜", objs: docs});
  });
};

// 上传新的图片
exports.newpic = function(req, res) {
  model.newpic(req, function(data){
    res.redirect("/appbg/findglass");
  });
};

// 删除图片
exports.delpic = function(req, res) {
  model.delpic(req.body, function(ret){
    res.end(JSON.stringify(ret));
  });
};
