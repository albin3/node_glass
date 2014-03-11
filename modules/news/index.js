// account 模块
var view = require('./view');

exports.register = function (app) {
  app.get('/appbg/news', view.index);
  app.get('/appbg/editnews/:newsid', view.editnews);        // 跳转到编辑新闻的页面
  app.post('/appbg/news/updatepic/:newsid', view.updatepic); // 更换焦点图
  app.post('/appbg/news/edit', view.editnews);               // 
  app.post('/appbg/news/add', view.addnews);
  app.post('/appbg/news/del', view.delnews);
  app.post('/appbg/news/delall', view.delall);
  app.post('/appbg/news/chpic/:newsid', view.chpic);         // 修改新闻首图
  app.post('/appbg/news/addpic/:newsid', view.addpic);       // 增加新闻图片
};
