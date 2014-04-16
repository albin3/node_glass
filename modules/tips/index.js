// tips模块
var view = require('./view');

exports.register = function (app) {
  app.get('/appbg/tips', view.tips);
  app.post('/appbg/tips/new', view.newtips);
  app.post('/appbg/tips/del', view.deltips);
  app.post('/appbg/tips/delall', view.delall);
};
