// account 模块
var view = require('./view');

exports.register = function (app) {
  app.get('/appbg/userctrl', view.userctrl);                          // 用户控制主页
  // app.get('/appbg/userctrl/edituser/:userid', view.edituser);         // 编辑用户
  app.get('/appbg/userctrl/exportexcel/', view.exportexcel);          // 导出到Excel
  // app.post('/appbg/userctrl/updateuser/:userid', view.updateuser);    // 更新用户
  app.post('/appbg/userctrl/changestate/:userid', view.changestate);  // 改变用户状态（封停，正常）
  app.post('/appbg/userctrl/deluser/', view.userdel);                 // 删除用户
};
