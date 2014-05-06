// view.js product
var model = require('./model');

// product管理主页
exports.products = function (req, res) {
  model.allproduct(req, function(ret){
    res.render('product/index', {Title: "Products Management", products: ret.val ,language: req.params.lan});
  });
};

// 编辑商品
exports.toedit = function (req, res) {
  model.toedit(req,function(ret){
    model.getStores(req, function(stores){
      if (stores.ret !== 1)
        res.render('product/editproduct', {Title: "Products Management", product: {}, language: req.params.lan, stores: [], totalPages: 0});
      else 
        res.render('product/editproduct', {Title: "Products Management", product: ret.val, language: req.params.lan, stores: stores.val, totalPages: stores.totalPages});
    });
  }); 
};

// 新增商品
exports.tonewproduct = function (req, res) {
  res.render('product/editproduct', {Title: "Products Management", language: req.params.lan, stores: [], totalPages: 0});
};

// 新增product
exports.newproduct = function (req, res) {
  model.newproduct(req, function(ret) {
    res.redirect('/appbg/product/'+req.params.lan);
  });
};

// 删除product
exports.delproduct = function (req, res) {
  model.delproduct(req.body, function(ret) {
    res.end(JSON.stringify(ret));
  });
};

// 删除所有
exports.delall = function (req, res) {
  model.delall (req, function(ret) {
    res.end(JSON.stringify(ret));
  });
};

// 改变商品的店铺列表
exports.sale = function(req, res) {
  model.sale(req, function(ret){
    res.end(JSON.stringify(ret));
  });
};

// 改变商品的店铺促销状态
exports.discount = function(req, res) {
  model.discount(req, function(ret){
    res.end(JSON.stringify(ret));
  });
};

// 分页获取店铺信息
exports.storesinpage = function(req, res) {
  model.storesinpage(req, function(ret){
    res.end(JSON.stringify(ret));
  });
};

// 上传视频文件
exports.uploadmovies = function (req, res) {
  model.uploadmovies(req, function (ret) {
    res.redirect("/appbg/product/"+req.params.lan);
  });
};

