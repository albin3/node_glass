// App用户管理页面
var model = require("./model");
var config = require("../../config");

/**
 * 后台用户管理首页
 */
exports.userctrl = function (req, res) {
  model.alluser(function(err, docs) {
    if (req.session.current_user !== config.root_user.username) {
      res.end('Only root user can management this page.');
    }
    if (err || docs.length === 0) {
      return res.render('bguser/index', { Title: "Background User", language: req.params.lan });
    }
    return res.render('bguser/index', { Title: "Background User", language: req.params.lan, users: docs });
  });
};

/**
 * 用户编辑页面
 */
exports.edituser = function (req, res) {
  model.finduser(req.params.userid, function(err, doc) {
    if (err || !doc) {
      return res.render('bguser/edituser', { Title: "App用户管理", userid: req.params.userid });
    }
    return res.render('bguser/edituser', { Title: "App用户管理", user: doc, userid: req.params.userid});
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
 * 删除所有用户
 */
exports.delall = function (req, res) {
  model.delall(function(ret) {
    return res.end(JSON.stringify(ret));
  });
};

/**
 * 改变用户的状态
 */
exports.changestate = function (req, res) {
  model.changestate(req.params.userid, req.body, function(err, doc) {
    var state = false;
    if (err) {
      return res.end(JSON.stringify({ status: false, state: state }));
    }
    if (!req.body.disable) {
      state   = true;
    }
    return res.end(JSON.stringify({ status: true, state: state }));
  });
};

/**
 * 增加一个后台用户
 */
exports.adduser = function (req, res) {
  model.adduser(req.body, function (ret) {
    return res.end(JSON.stringify(ret));
  });
};
