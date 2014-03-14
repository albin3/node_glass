// bguser index.js 后台用户管理
var view = require('./view');

exports.register = function (app) {
  app.get('/appbg/bguser', view.userctrl);
  app.post('/appbg/bguser/adduser/', view.adduser);
  app.post('/appbg/bguser/deluser/', view.userdel);
  app.get('/appbg/bguser/edituser/:userid', view.edituser);
  app.post('/appbg/bguser/updateuser/:userid', view.updateuser);
  app.post('/appbg/bguser/changestate/:userid', view.changestate);
  app.post('/appbg/bguser/delall/', view.delall);
};
