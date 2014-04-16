// 紫外线指数 view.js
var model = require('./model');

exports.uvindex = function (req, res) {
  res.render("uvindex/index", {Title: "UVIndex And Push", language: req.params.lan});
};

// 推送
exports.pushuvindex = function (req, res) {
  model.pushuvindex(function(ret){
    res.end(JSON.stringify(ret));
  });
};
