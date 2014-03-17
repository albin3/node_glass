// news 模块
var view = require('./view');

exports.register = function (app) {
  app.get('/appbg/prod', view.index);
  app.get('/appbg/prod/edit/:newsid', view.editnews);                 // 跳转到编辑新闻的页面
  app.post('/appbg/prod/edit/:newsid', view.updatenews);              // 提交修改的内容
  app.post('/appbg/prod/add', view.addnews);                          // 增加新闻
  app.post('/appbg/prod/del', view.delnews);                          // 删除一条新闻
  app.post('/appbg/prod/delall', view.delall);                        // 删除所有新闻
  app.post('/appbg/prod/changestate/:newsid', view.changestate);      // 改变新闻的焦点图状态
};

