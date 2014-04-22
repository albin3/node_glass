// appapi 模块
var view = require('./view');

exports.register = function (app) { 
  app.all('/appapi/*', view.setheader);                                             // 全部以JSON形式返回
                                                                                    
  app.post('/appapi/newuser/', view.newuser);                                       // 用户注册新户信息
  app.post('/appapi/updateuser/:userid', view.updateuser);                          // 用户更新用户信息
  app.all('/appapi/chpassword/:userid/:oldpsd/:newpsd', view.chpassword);           // 用户修改用户密码
  app.all('/appapi/resetpassword/:userid', view.resetpassword);                     // 用户重置用户密码
  app.all('/appapi/usersignin/:type/:name/:password', view.usersignin);             // 用户登录
                                                                                    
  app.all('/appapi/newslist/:numPerPage/:pageNum/:lan', view.newslist);                  // 新闻列表
  app.all('/appapi/newsfocuspic/:num/:lan', view.slide);                             // 新闻焦点图片
  app.all('/appapi/newsdetails/:newsid', view.newsdetails);                         // 新闻详情
                                                                                    
  app.post('/appapi/games/uvcatcher/:lan', view.uvcatcher);                         // 游戏-紫外线收割机
  app.all('/appapi/games/uvrank/:lan', view.uvrank);                                // 游戏-紫外线收割机排行榜
  app.post('/appapi/games/findglass/:lan', view.findglass);                         // 游戏-寻找黄眼镜
  app.all('/appapi/games/findglass/pulldata/:timestamp/:lan', view.findglasspulldata);   // 游戏-寻找黄眼镜拉图片数据
  app.all('/appapi/games/fgrank/:lan', view.fgrank);                                // 游戏-寻找黄眼镜排行榜
                                                                                   
  app.post('/appapi/coupon/getcoupon', view.getcoupon);                             // 优惠券获得
  app.post('/appapi/coupon/checkcoupon', view.checkcoupon);                         // 优惠券有效性验证
  app.post('/appapi/coupon/usecoupon', view.usecoupon);                             // 优惠券使用
  app.get('/appapi/coupon/couponlist/:userid', view.couponlist);                     // 优惠券列表
  app.get('/appapi/sharelink/:userid/:lan',view.sharelink);

  app.get('/appapi/regional', view.regional);  //获取省市县
  app.post('/appapi/store/:lan',view.store);   //根据地区获取门店列表

  app.get('/appapi/random',view.random);       //获取随机数 


};
