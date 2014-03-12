// appapi模块
var view = require('./view');

exports.register = function (app) { 
  app.all('/appapi/*', view.setheader);
  app.post('/appapi/newuser/', view.newuser);
  app.post('/appapi/updateuser/:userid', view.updateuser);
  app.all('/appapi/usersignin/:type/:name/:password', view.usersignin);
};
