// appapi模块
var view = require('./view');

exports.register = function (app) { 
  app.all('/appapi/*', view.setheader);                                   // 全部以JSON形式返回

  app.post('/appapi/newuser/', view.newuser);                             // 注册新户信息
  app.post('/appapi/updateuser/:userid', view.updateuser);                // 更新用户信息
  app.all('/appapi/chpassword/:userid/:oldpsd/:newpsd', view.chpassword); // 修改用户密码
  app.all('/appapi/resetpassword/:userid', view.resetpassword);           // 重置用户密码
  app.all('/appapi/usersignin/:type/:name/:password', view.usersignin);   // 用户登录

  app.all('/appapi/newslist', view.newslist);

};
