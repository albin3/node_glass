// index.js appleversion
var view = require('./view');

exports.register = function (app) {
  app.get('/appbg/appleversion/:lan', view.appversion);
  app.post('/appbg/appleversion/update/:lan', view.versionupdate);
};
