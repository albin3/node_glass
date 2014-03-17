// index.js appversion
var view = require('./view');

exports.register = function (app) {
  app.get('/appbg/appversion/', view.appversion);
};
