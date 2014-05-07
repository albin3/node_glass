// App用户管理页面
var model = require("./model");

/**
 * 用户管理首页
 */
exports.userctrl = function (req, res, next) {
  if (req.params.lan!=="simplified" && req.params.lan!=="traditional" && req.params.lan!=="english")
    return next();
  model.alluser(function(err, docs) {
    if (err || docs.length === 0) {
      return res.render('userctrl/index', { Title: "App User Management", language: req.params.lan });
    }
    return res.render('userctrl/index', { Title: "App User Management", language: req.params.lan, appusers: docs });
  });
};

/**
 * 用户编辑页面
 */
exports.edituser = function (req, res) {
  model.finduser(req.params.userid, function(err, doc) {
    if (err || !doc) {
      return res.render('userctrl/edituser', { Title: "App用户管理", userid: req.params.userid });
    }
    return res.render('userctrl/edituser', { Title: "App用户管理", user: doc, userid: req.params.userid});
  });
};

/**
 * 用户数据更新
 */
exports.updateuser = function (req, res) {
  model.updateuser(req, function(err, doc) {
    if (err || !doc) {
      return res.end(JSON.stringify({ status: false }));
    }
    return res.end(JSON.stringify({ status: true}));
  });
};

/**
 * 删除指定用户
 */
exports.userdel = function (req, res) {
  model.userdel(req.body.id, function(err) {
    if (err) {
      return res.end(JSON.stringify({ status: false }));
    }
    return res.end(JSON.stringify({ status: true }));
  });
};

/**
 * 改变用户的状态
 */
exports.changestate = function (req, res) {
  console.log(req.params);
  console.log(req.body);
  model.changestate(req.params.userid, req.body, function(err, doc) {
    var state = false;
    if (err) {
      return res.end(JSON.stringify({ status: false, state: state }));
    }
    if (!req.body.disable) {
      state = true;
    }
    return res.end(JSON.stringify({ status: true, state: state }));
  });
};

/**
 * 导出到Excel
 */
exports.exportexcel = function (req, res) {
  model.exportexcel(function(ret) {
    res.redirect("/appuser/appuser.xlsx");
    // res.download(ret.appUserPath);
    // res.end(JSON.stringify(ret));
  });
}
