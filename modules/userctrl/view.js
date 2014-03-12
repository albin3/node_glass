// App用户管理页面
var model = require("./model");

/**
 * 用户管理首页
 */
exports.userctrl = function (req, res) {
  model.alluser(function(err, docs) {
    if (err || docs.length === 0) {
      return res.render('userctrl/index', { Title: "App用户管理" });
    }
    console.log(docs);
    return res.render('userctrl/index', { Title: "App用户管理", appusers: docs });
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
  model.changestate(req.params.userid, req.body, function(err, doc) {
    var state = "(封停)";
    if (err) {
      return res.end(JSON.stringify({ status: false, state: state }));
    }
    if (!req.body.disable) {
      state = "(正常)";
    }
    return res.end(JSON.stringify({ status: true, state: state }));
  });
};

