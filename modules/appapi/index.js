// appapi模块
var view = require('./view');

exports.register = function (app) {
  app.post('/appapi/newuser', view.newuser);
};
