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
  model.pagednews(req, function(ret){
    res.end(JSON.stringify(ret));
  });
};
// 新闻焦点图片
exports.slide = function (req, res) {
  model.slide(req, function (ret) {
    res.end(JSON.stringify(ret));
  });
};
// 新闻详情
exports.newsdetails = function (req, res) {
  model.newsdetails(req.params.newsid, function (ret) {
    res.end(JSON.stringify(ret));
  });
};

// ###游戏接口
// 紫外线收割机
exports.uvcatcher = function (req, res) {
  model.uvcatcher(req.body, function(ret){
    res.end(JSON.stringify(ret));
  });
};
// 紫外线收割机排行榜
exports.uvrank = function (req, res) {
  model.uvrank(function(ret){
    res.end(JSON.stringify(ret));
  });
};
// 寻找黄眼镜
exports.findglass = function (req, res) {
  model.findglass(req.body, function(ret){
    res.end(JSON.stringify(ret));
  });
};
// 寻找黄眼镜获取图片数据
exports.findglasspulldata = function (req, res) {
  model.findglasspulldata(req.params, function(ret){
    res.end(JSON.stringify(ret));
  });
};
// 寻找黄眼镜排行榜
exports.fgrank = function (req, res) {
  model.fgrank(function(ret){
    res.end(JSON.stringify(ret));
  });
};

// ###优惠券
// 获得优惠券
exports.getcoupon = function(req, res) {
  model.getcoupon(req.body, function(ret){
    res.end(JSON.stringify(ret));
  });
};
// 验证优惠券
exports.checkcoupon = function(req, res) {
  model.checkcoupon(req.body, function(ret){
    res.end(JSON.stringify(ret));
  });
};
// 使用优惠券
exports.usecoupon = function(req, res) {
  model.usecoupon(req.body, function(ret){
    res.end(JSON.stringify(ret));
  });
};
// 优惠券列表
exports.couponlist = function(req, res) {
  model.couponlist(req.params, function(ret){
    res.end(JSON.stringify(ret));
  });
};
// 地区列表
exports.regional = function(req, res) {
  model.regional(function(ret){
    res.end(JSON.stringify(ret));
  });
};
// 门店列表
exports.store = function(req, res){
  model.store(req,function(ret){
    res.end(JSON.stringify(ret));
  });
}
// 紫外线随机数
exports.random = function(req, res){
  model.random(function(ret){
    res.end(JSON.stringify(ret));
  });
}
