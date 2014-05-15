// news view.js
var model = require('./model');


// 获取编辑界面
exports.brand = function (req,res) {
  model.allbrand(req, function(ret){
    res.render('brand/index', {Title: "Brand Management", brandlist: ret.val ,language: req.params.lan});
  });
};

// 获取编辑品牌界面
exports.getaddbrand = function (req,res) {
  res.render("brand/editbrand",{Title: "Brand Management",language:req.params.lan});
};

// 增加品牌
exports.addbrand = function (req,res) {
  model.addbrand(req, function (ret) {
    res.render("brand/editbrand",{Title: "Brand Management",language:ret.lan,slide:ret});
  });
};

// 删除品牌
exports.del = function (req, res) {
  model.del(req.body, function (err) {
    if (!err) {
      res.end(JSON.stringify({status: true}));
    } else {
      res.end(JSON.stringify({status: false}));
    } 
  });
};

// 删除所有品牌
exports.delall = function (req, res) {
  model.delall(req, function (err) {
    if (!err) {
      res.end(JSON.stringify({status: true}));
    } else {
      res.end(JSON.stringify({status: false}));
    } 
  });
};

