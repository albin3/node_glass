// view.js sharelink
var model = require("./model");

// 分享链接统计
exports.sharelink = function(req, res) {
  model.sharelink(req, function(ret){
    res.end(JSON.stringify(ret));
  });
};

// 分享链接新闻
exports.sharenews = function(req, res) {
  model.sharenews(req, function(ret){
    if (ret.ret===1) {
      res.render('sharelink/news', {objid: req.params.objid, news: ret.val, language: ret.val.lan });
    } else {
      res.render('sharelink/news', {objid: req.params.objid, news: null, language: "simplified" });
    }
  });
};

// 分享链接产品
exports.shareprod = function(req, res) {
  model.shareprod(req, function(ret){
    if (ret.ret===1) {
      res.render('sharelink/prod', {objid: req.params.objid, prod: ret.val, language: ret.val.lan });
    } else {
      res.render('sharelink/prod', {objid: req.params.objid, prod: null, language: "simplified" });
    }
  });
};

// 分享链接新闻
exports.sharemain = function(req, res) {
  model.sharemain(req, function(ret){
    if (ret.ret===1) {
      res.render('sharelink/main', { language: req.params.lan });
    } else {
      res.render('sharelink/main', { language: "simplified" });
    }
  });
};

// 分享下载
exports.download = function(req, res) {
  model.download(req, function(ret) {
    if (ret.ret===1) {
      res.render('sharelink/download', { language: req.params.lan });
    } else {
      res.render('sharelink/download', { language: "simplified" });
    }
  });
};
