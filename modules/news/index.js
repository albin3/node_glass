// news 模块
var view = require('./view');

exports.register = function (app) {
  app.get('/appbg/news/:lan', view.index);
  app.get('/appbg/news/edit/:newsid', view.editnews);         // 跳转到编辑新闻的页面
  app.post('/appbg/news/edit/:newsid', view.updatenews); // 提交修改的内容
  app.post('/appbg/news/add/:lan', view.addnews);                  // 增加新闻
  app.post('/appbg/news/del', view.delnews);                  // 删除一条新闻
  app.post('/appbg/news/delall/:lan', view.delall);                // 删除所有新闻
  app.post('/appbg/news/changestate/:newsid', view.changestate);      // 改变新闻的焦点图状态
  app.get('/appbg/news/getslide/:lan', view.getslide);     
  app.get('/appbg/news/getslide/addslide/:lan', view.getaddslide);
  app.post('/appbg/news/getslide/addslide/:lan', view.addslide);
  app.post('/appbg/news/getslide/delall/:lan', view.delallslide);
  app.post('/appbg/news/getslide/del', view.delslide);
};

