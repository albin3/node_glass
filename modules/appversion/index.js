// index.js appversion
var view = require('./view');

exports.register = function (app) {
  app.get('/appbg/appversion/:lan', view.appversion);
  app.post('/appbg/appversion/update/:lan', view.versionupdate);
  app.all('/sharelink/:userid/:lan', view.sharelink);
};
