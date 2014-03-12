// account 模块
var view = require('./view');

exports.register = function (app) {
  app.get('/appbg/userctrl', view.userctrl);
  app.get('/appbg/userctrl/edituser/:userid', view.edituser);
  app.post('/appbg/userctrl/updateuser/:userid', view.updateuser);
  app.post('/appbg/userctrl/changestate/:userid', view.changestate);
  app.post('/appbg/userctrl/deluser/', view.userdel);
};
