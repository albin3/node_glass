// view.js appversion
var model = require('./model');

// 主页
exports.appversion = function (req, res) {
  model.currentVersion(req, function(ret){
    res.render('appleversion/index', {Title: 'IOS Version Management', language: req.params.lan, version: ret.doc});
  });
};

// 更新版本信息
exports.versionupdate = function (req, res) {
  model.versionupdate(req, function(ret){
    res.end(JSON.stringify(ret));
  });
};
