// view.js appversion
var model = require('./model');

// 主页
exports.appversion = function (req, res) {
  model.currentVersion(function(ret){
    res.render('appversion/index', {Title: 'App版本管理', version: ret.doc});
  });
};

// 更新版本信息
exports.versionupdate = function (req, res) {
  model.versionupdate(req, function(data){
    if (data.ret === 1){
      return res.redirect('/appbg/appversion');
    }
    if (data.ret === 3){
      return res.end("没有上传文件");
    }
    if (data.ret === 2){
      return res.end("更新版本出错");
    }
  });
};
