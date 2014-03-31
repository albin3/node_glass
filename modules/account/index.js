// account 模块
var view = require('./view');

exports.register = function (app) {
  app.get('/', view.signin);
  app.get('/appbg(/?)*', view.checksignin);
  app.post('/account/new', view.newaccount);
  app.post('/account/signin', view.authenticate);
  app.post('/account/signout', view.signout);
  app.get('/account/signin', view.signin);
};
