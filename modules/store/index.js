// tips模块
var view = require('./view');

exports.register = function (app) {
  app.get('/appbg/store/:lan', view.store);
  app.get('/appbg/store/new/:lan', view.tonewstore);
  app.post('/appbg/store/new/:lan', view.newstore);
  app.get('/appbg/store/edit/:id/:lan', view.toedit);
  app.post('/appbg/store/del', view.delstore);
  app.post('/appbg/store/delall/:lan', view.delall);
};