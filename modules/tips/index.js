// tips模块
var view = require('./view');

exports.register = function (app) {
  app.get('/appbg/tips/:lan', view.tips);
  app.post('/appbg/tips/new/:lan', view.newtips);
  app.post('/appbg/tips/del', view.deltips);
  app.post('/appbg/tips/delall/:lan', view.delall);
};
