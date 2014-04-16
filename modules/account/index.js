// account 模块
var view = require('./view');

exports.register = function (app) {
  app.get('/', view.signin);
  // app.get('/appbg(/?)*', view.checksignin); TODO: 在这里增加language的合法检测
  app.post('/account/new', view.newaccount);
  app.post('/account/signin/:language', view.authenticate);
  app.post('/account/signout', view.signout);
  app.post('/account/currentuser', view.currentuser);
  app.get('/account/signin', view.signin);
};
