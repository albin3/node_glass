// prods 模块
var view = require('./view');

exports.register = function (app) {
  app.get('/appbg/prod/:lan', view.index);
  app.get('/appbg/prod/edit/:newsid', view.editnews);                 // 跳转到编辑产品的页面
  app.post('/appbg/prod/edit/:newsid', view.updatenews);              // 提交修改的内容
  app.post('/appbg/prod/add', view.addnews);                          // 增加产品
  app.post('/appbg/prod/del', view.delnews);                          // 删除一个产品
  app.post('/appbg/prod/delall', view.delall);                        // 删除所有产品
  app.post('/appbg/prod/changestate/:newsid', view.changestate);      // 改变产品的焦点图状态
  app.post('/appbg/prod/uploadmovies/:lan', view.uploadmovies);
};

