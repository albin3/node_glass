// view.js appversion
var model = require('./model');

// 主页
exports.appversion = function (req, res) {
  model.currentVersion(req, function(ret){
    res.render('appversion/index', {Title: 'App Version Management', language: req.params.lan, version: ret.doc});
  });
};

// 更新版本信息
exports.versionupdate = function (req, res) {
  model.versionupdate(req, function(data){
    if (data.ret === 1){
      return res.redirect('/appbg/appversion/'+req.params.lan);
    }
    if (data.ret === 3){
      return res.end("No file uploaded.");
    }
    if (data.ret === 2){
      return res.end("An err occurred.");
    }
  });
};
