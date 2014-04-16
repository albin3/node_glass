// view.js tips
var model = require('./model');

// tips管理主页
exports.tips = function (req, res) {
  model.alltips(function(ret){
    res.render('tips/index', {Title: "Tips Management", tips: ret.val});
  });
};

// 新增tips
exports.newtips = function (req, res) {
  model.newtips(req.body, function(ret) {
    res.end(JSON.stringify(ret));
  });
};

// 删除tips
exports.deltips = function (req, res) {
  model.deltips(req.body, function(ret) {
    res.end(JSON.stringify(ret));
  });
};

// 删除所有
exports.delall = function (req, res) {
  model.delall (function(ret) {
    res.end(JSON.stringify(ret));
  });
};
