// productions view.js
var model = require('./model');

// 获取页面首页 
exports.index = function (req, res) {
  model.allobjs(function (err, docs) {
    if (!err) {
      res.render('products/index', {Title: "Products And Push", language: req.params.lan, newslist: docs});
    } else {
      res.render('products/index', {Title: "Products And Push", language: req.params.lan});
    } 
  });
};

// 编辑新闻页面
exports.editnews = function (req, res) {
  model.findOneNews(req.params.newsid, function(err, doc){
    if (err) {
      res.end(err);
    } else {
      res.render("products/editnews", {Title: "Products And Push", _id: req.params.newsid, news: doc});
    }
  });
};

// 增加新闻，返回在数据库中的id
exports.addnews = function (req, res) {
  model.addnews(req.body, function (err, doc) {
    if (!err) {
      res.end(JSON.stringify({
        status: true,
        doc: doc
      }));
    } else {
      res.end(JSON.stringify({status: false}));
    }
  });
};

// 删除新闻
exports.delnews = function (req, res) {
  model.delnews(req.body, function (err) {
    if (!err) {
      res.end(JSON.stringify({status: true}));
    } else {
      res.end(JSON.stringify({status: false}));
    } 
  });
};

// 删除所有商品
exports.delall = function (req, res) {
  model.delall(function (err) {
    if (!err) {
      res.end(JSON.stringify({status: true}));
    } else {
      res.end(JSON.stringify({status: false}));
    } 
  });
};

// 更新新闻数据
exports.updatenews = function (req, res) {
  model.updatenews(req, function (err, data) {
    if (err) {
      res.end(JSON.stringify({status: false}));
    }
    res.end(JSON.stringify({status: true}));
  });
};

// 更新焦点图
exports.changestate = function (req, res) {
  model.changestate(req, function (err, data) {
    if (err) {
      res.end(JSON.stringify({status: false}));
    }
    res.end(JSON.stringify({status: true, state: data.state}));
  });
};

// 上传视频文件
exports.uploadmovies = function (req, res) {
  model.uploadmovies(req, function (ret) {
    res.redirect("/appbg/prod/"+req.params.lan);
  });
};

