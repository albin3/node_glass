// view.js sharelink
var model = require("./model");

// 分享链接统计
exports.sharelink = function(req, res) {
  model.sharelink(req, function(ret){
    res.end(JSON.stringify(ret));
  });
};

// 分享链接首页
exports.sharepage = function(req, res) {
  model.sharepage(req, function(ret){
    res.render('sharelink/index', {page: ret.val.page, param: ret.val.param});
  });
};


