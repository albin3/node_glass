// index.js appversion
var view = require('./view');

exports.register = function (app) {
  app.get('/appbg/appversion', view.appversion);
  app.post('/appbg/appversion/update', view.versionupdate);
};
