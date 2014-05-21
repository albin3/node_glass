// tips模块
var view = require('./view');

exports.register = function (app) {
  app.get('/appbg/product/:lan', view.products);            // 产品首页
  app.post('/appbg/product/paged/:lan', view.getProducts);  // 分页产品信息
  app.get('/appbg/product/new/:lan', view.tonewproduct);    // 新建产品
  app.post('/appbg/product/new/:lan', view.newproduct);
  app.get('/appbg/product/edit/:id/:lan', view.toedit);
  app.post('/appbg/product/del', view.delproduct);
  app.post('/appbg/product/push', view.pushproduct);
  app.post('/appbg/product/delall/:lan', view.delall);
  app.post('/appbg/product/sale/:lan', view.sale);
  app.post('/appbg/product/salelist/:lan', view.salelist);
  app.post('/appbg/product/discount/:lan', view.discount);
  app.post('/appbg/product/stores/:page_num/:lan', view.storesinpage);
  app.post('/appbg/product/uploadmovies/:lan', view.uploadmovies);
};
