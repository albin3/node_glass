// view.js 界面
var model = require('./model');

// 登录
exports.signin = function (req, res) {
  res.render('account/signin',{});
};

// 注销登录
exports.signout = function (req, res) {
  req.logout_user();
  res.end(JSON.stringify({ret: 1}));        // 返回注销成功
};

// 获取当前用户
exports.currentuser = function (req, res) {
  res.end(JSON.stringify(req.session));        // 返回注销成功
};

exports.newaccount = function (req, res) {
  var account = req.body;
  model.newaccount(account, function (err, data) {
    if (err || !data) { return res.end(JSON.stringify({ status: false }));}
    else { return res.end(JSON.stringify({ status: true }));}
  });
};

exports.authenticate = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  model.authenticate({
    username: username,
    password: password
  },function (err, LastErr) {
    if (err || LastErr) {
      if (LastErr === 1) {
        return res.end("no user");
        //return res.end(JSON.stringify({status: false, message: "用户名不存在"}));
      } else if (LastErr === 2) {
        return res.end("invalid password..");
        //return res.end(JSON.stringify({status: false, message: "用户名密码不匹配"}));
      } else if (LastErr === 3) {
        return res.end("用户已经被禁用..");
      }
    } else {
      // return res.end("success..");
        req.login_user(username);
        res.redirect('/appbg/news');
    }
  });
};

exports.checksignin = function (req, res, next) {
  if (req.session!== undefined && req.session.current_user && req.session.current_user.is_authenticated !== false) {
    next();
  } else {
    res.render('account/signin',{});
  }
};

exports.require_signin = require("current-user").require_login; // 用外部库里的登录控制逻辑[目前不使用]
