// news view.js
var model = require('./model');

// 获取页面首页 
exports.index = function (req, res) {
  model.allnews(function (err, docs) {
    if (!err) {
      res.render('news/index', {Title: "新闻及推送", newslist: docs});
    } else {
      res.render('news/index', {Title: "新闻及推送"});
    } 
  });
};

// 更新焦点图
exports.updatepic = function (req, res) {
  model.updatepic(req, function () {
    res.redirect('/appbg/news');
  });
};

// 编辑，更新商品
exports.editnews = function (req, res) {
  model.findOneNews(req.params.newsid, function(err, doc){
    console.log(doc);
    if (err) {
      res.end(err);
    } else {
      res.render("news/editnews", {Title: "新闻及推送", _id: req.params.newsid, news: doc});
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

// 删除商品
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
      res.end(json.stringify({status: true}));
    } else {
      res.end(json.stringify({status: false}));
    } 
  });
};

// 添加新闻图片
exports.addpic = function (req, res) {
  model.addpic(req, function(err, doc){
    if (err) {
      return res.end(JSON.stringify({status: false}));
    } else {
      return res.end(JSON.stringify({status: true, news: doc}));
    }
  });
};

// 更换首图
exports.chpic = function (req, res) {
  model.chpic(req, function(err, news){
    if (err) {
      return res.end(JSON.stringify({status: false}));
    } else {
      return res.end(JSON.stringify({status: true, news: news}));
    }
  });
};

