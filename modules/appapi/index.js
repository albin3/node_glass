// appapi模块
var view = require('./view');

exports.register = function (app) { 
  app.all('/appapi/*', view.setheader);                                   // 全部以JSON形式返回

  app.post('/appapi/newuser/', view.newuser);                             // 用户注册新户信息
  app.post('/appapi/updateuser/:userid', view.updateuser);                // 用户更新用户信息
  app.all('/appapi/chpassword/:userid/:oldpsd/:newpsd', view.chpassword); // 用户修改用户密码
  app.all('/appapi/resetpassword/:userid', view.resetpassword);           // 用户重置用户密码
  app.all('/appapi/usersignin/:type/:name/:password', view.usersignin);   // 用户登录

  app.all('/appapi/newslist/:numPerPage/:pageNum', view.newslist);        // 新闻列表
  app.all('/appapi/newsfocuspic/:num', view.newsfocus);                   // 新闻焦点图片
  app.all('/appapi/newsdetails/:newsid', view.newsdetails);               // 新闻详情

  app.post('/appapi/games/uvcatcher', view.uvcatcher);                    // 游戏-紫外线收割机
  app.all('/appapi/games/uvrank', view.uvrank);                          // 游戏-紫外线收割机排行榜
  app.post('/appapi/games/findglass', view.findglass);                    // 游戏-寻找黄眼镜
  app.all('/appapi/games/fgrank', view.fgrank);                          // 游戏-寻找黄眼镜排行榜

  app.post('/appapi/coupon/getcoupon', view.getcoupon);                   // 优惠券获得
};
