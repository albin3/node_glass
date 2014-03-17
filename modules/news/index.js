// news 模块
var view = require('./view');

exports.register = function (app) {
  app.get('/appbg/news', view.index);
  app.get('/appbg/news/edit/:newsid', view.editnews);         // 跳转到编辑新闻的页面
  app.post('/appbg/news/edit/:newsid', view.updatenews);      // 提交修改的内容
  app.post('/appbg/news/add', view.addnews);                  // 增加新闻
  app.post('/appbg/news/del', view.delnews);                  // 删除一条新闻
  app.post('/appbg/news/delall', view.delall);                // 删除所有新闻
  app.post('/appbg/news/changestate/:newsid', view.changestate);      // 改变新闻的焦点图状态
};

