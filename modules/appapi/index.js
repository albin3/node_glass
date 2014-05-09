// appapi 模块
var view = require('./view');

exports.register = function (app) { 
  app.all('/appapi/*', view.setheader);                                             // 全部以JSON形式返回
                                                                                    
  app.post('/appapi/newuser/', view.newuser);                                       // 用户注册新户信息
  app.post('/appapi/updateuser/:userid', view.updateuser);                          // 用户更新用户信息
  app.all('/appapi/chpassword/:userid/:newpsd', view.chpassword);                   // 用户修改用户密码
  app.all('/appapi/resetpassword/:userid', view.resetpassword);                     // 用户重置用户密码
  app.all('/appapi/usersignin', view.usersignin);                                   // 用户登录
                                                                                    
  app.all('/appapi/newslist/:numPerPage/:pageNum/:lan', view.newslist);             // 新闻列表
  app.all('/appapi/newsfocuspic/:num/:lan', view.slide);                            // 新闻焦点图片
  app.all('/appapi/newsdetails/:newsid', view.newsdetails);                         // 新闻详情
                                                                                    
  app.post('/appapi/games/uvcatcher/:lan', view.uvcatcher);                         // 游戏-紫外线收割机
  app.all('/appapi/games/uvrank/:lan', view.uvrank);                                // 游戏-紫外线收割机排行榜
  app.post('/appapi/games/findglass/:lan', view.findglass);                         // 游戏-寻找黄眼镜
  app.all('/appapi/games/findglass/pulldata/:timestamp/:lan', view.findglasspulldata);   // 游戏-寻找黄眼镜拉图片数据
  app.all('/appapi/games/fgrank/:lan', view.fgrank);                                // 游戏-寻找黄眼镜排行榜
                                                                                     
  app.post('/appapi/coupon/getcoupon/:lan', view.getcoupon);                        // 优惠券获得
  app.get('/appapi/coupon/couponlist/:userid/:page/:limit', view.couponlist);       // 优惠券列表
  app.post('/appapi/coupon/checkcoupon', view.checkcoupon);                         // 优惠券有效性验证
  app.post('/appapi/coupon/usecoupon', view.usecoupon);                             // 优惠券使用
  app.get('/appapi/sharelink/:userid/:lan',view.sharelink);
  app.post('/appapi/storecoupon', view.storecoupon);                                // 用户点击产品存储优惠券
  //商店部分
  app.get('/appapi/getprovince/:lan',view.getprovince);                             // 获取省
  app.post('/appapi/getcity/:lan',view.getcity);                                    // 获取市
  app.post('/appapi/getarea/:lan',view.getarea);                                    // 获取县区
  app.post('/appapi/store/:lan',view.store);                                        // 根据地区获取门店列表
  app.get('/appapi/brand/:lan',view.brand);                                         // 获取品牌列表
  app.all('/appapi/product/:lan',view.products);                                    // 根据品牌获取产品列表
  app.all('/appapi/productdetail/:id',view.productdetail);                          // 获取产品详情

  app.all('/appapi/stores/:prodid/:limit/:skip/:lng/:lat/:prov/:muni/:area/:cont',view.prodstores);         // 获取商品的店铺信息

  //其他
  app.get('/appapi/random',view.random);                                            // 获取随机数 
  app.post('/appapi/gettips/:lan',view.gettips);                                    // 获取tips

  app.get('/appapi/appversion/:lan',view.appversion);                               // 获取版本信息
};
