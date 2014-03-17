// view.js appversion

exports.appversion = function (req, res) {
  res.render('appversion/index', {Title: 'App版本管理'});
};
