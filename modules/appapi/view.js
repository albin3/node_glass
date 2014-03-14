// appapi view
var model = require('./model');

// 设置返回的数据格式为json
exports.setheader = function(req, res, next) {
  res.setHeader('Content-Type', 'application/json');
  next();
};

// 注册新用户
exports.newuser = function (req, res) {
  model.newuser(req.body, function (ret) {
    res.end(JSON.stringify(ret));
  });
};

// 修改用户信息
exports.updateuser = function (req, res) {
  model.updateuser(req, function (ret) {
    res.end(JSON.stringify(ret));
  });
};

// 修改用户密码
exports.chpassword = function (req, res) {
  model.chpassword(req.params, function (ret) {
    res.end(JSON.stringify(ret));
  });
};

// 重置用户密码
exports.resetpassword = function (req, res) {
  model.resetpassword(req.params, function (ret) {
    res.end(JSON.stringify(ret));
  });
};

// 验证用户有效性
exports.usersignin = function (req, res) {
  model.usersignin(req.params, function(ret){
    res.end(JSON.stringify(ret));
  });
};

// ###新闻接口
// 新闻列表
exports.newslist = function (req, res) {
  model.allnews(function(ret){
    res.end(JSON.stringify(ret));
  });
};
