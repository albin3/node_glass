// 广告图片 view.js
var model = require('./model');

// 广告图片主页
exports.index = function (req, res) {
  req.body.size = req.params.size;
  model.allpics(req, function(data) {
    res.render("loadingpic/index", {Title: "Loading Pic", language: req.params.lan, objs: data.docs});
  });
};

// 上传新的图片
exports.newpic = function(req, res) { 
  model.newpic(req, function(data){ 
    res.redirect("/appbg/loadingpic/"+req.params.lan);
  });
};

// 删除图片 
exports.delpic = function(req, res) { 
  model.delpic(req.body, function(ret){ 
    res.end(JSON.stringify(ret));
  });
};
