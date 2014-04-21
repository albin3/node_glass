// view.js store
var model = require('./model');

// store管理主页
exports.store = function (req, res) {
  model.allstore(req, function(ret){
    res.render('store/index', {Title: "Store Management", stores: ret.val ,language: req.params.lan});
  });
};

// 去store页面
exports.toedit = function (req, res) {
  model.toedit(req,function(ret){
    res.render('store/editstore', {Title: "Edit Store", store: ret.val, language: req.params.lan});
  }); 
};

// 去store页面
exports.tonewstore = function (req, res) {
  res.render('store/editstore', {Title: "Edit Store", language: req.params.lan});
};

// 新增store
exports.newstore = function (req, res) {
  console.log(req.body);
  model.newstore(req, function(ret) {
    res.redirect('/appbg/store/'+req.params.lan);
  });
};

// 删除store
exports.delstore = function (req, res) {
  model.delstore(req.body, function(ret) {
    res.end(JSON.stringify(ret));
  });
};

// 删除所有
exports.delall = function (req, res) {
  model.delall (req, function(ret) {
    res.end(JSON.stringify(ret));
  });
};
