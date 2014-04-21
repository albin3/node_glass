// news view.js
var model = require('./model');

// 获取页面首页 
exports.index = function (req, res) {
  model.allnews(req.params.lan, function (err, docs) {
    if (!err) {
      res.render('news/index', {Title: "News And Push", language: req.params.lan, newslist: docs});
    } else {
      res.render('news/index', {Title: "News And Push", language: req.params.lan});
    } 
  });
};

// 编辑新闻页面
exports.editnews = function (req, res) {
  model.findOneNews(req.params.newsid, function(err, doc){
    if (err) {
      res.end(err);
    } else {
      res.render("news/editnews", {Title: "News And Push", _id: req.params.newsid, news: doc, language: doc.lan});
    }
  });
};
// 获取编辑界面
exports.getslide = function (req,res) {
  model.allslide(req, function(ret){
    res.render('news/slide', {Title: "News And Push", slidelist: ret.val ,language: req.params.lan});
  });
};

// 获取编辑幻灯片界面
exports.getaddslide = function (req,res) {
  res.render("news/editslide",{Title: "News And Push",language:req.params.lan});
};

// 增加幻灯片
exports.addslide = function (req,res) {
  model.addslide(req, function (ret) {
    res.render("news/editslide",{Title: "News And Push",language:ret.lan,slide:ret});
  });
};

// 增加新闻，返回在数据库中的id
exports.addnews = function (req, res) {
  model.addnews(req, res.locals.current_user, function (err, doc) {
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

// 删除幻灯片
exports.delslide = function (req, res) {
  model.delslide(req.body, function (err) {
    if (!err) {
      res.end(JSON.stringify({status: true}));
    } else {
      res.end(JSON.stringify({status: false}));
    } 
  });
};

// 删除所有商品
exports.delall = function (req, res) {
  model.delall(req, function (err) {
    if (!err) {
      res.end(JSON.stringify({status: true}));
    } else {
      res.end(JSON.stringify({status: false}));
    } 
  });
};

// 删除所有幻灯片
exports.delallslide = function (req, res) {
  model.delallslide(req, function (err) {
    if (!err) {
      res.end(JSON.stringify({status: true}));
    } else {
      res.end(JSON.stringify({status: false}));
    } 
  });
};

// 更新新闻数据
exports.updatenews = function (req, res) {
  model.updatenews(req, res.locals.current_user, function (err, data) {
    res.redirect('/appbg/news/edit/' + req.params.newsid);
    /*
    if (err) {
      res.end(JSON.stringify({status: false}));
    }
    res.end(JSON.stringify({status: true}));
    */
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


