// tips模块
var view = require('./view');

exports.register = function (app) {
  app.get('/appbg/product/:lan', view.products);
  app.get('/appbg/product/new/:lan', view.tonewproduct);
  app.post('/appbg/product/new/:lan', view.newproduct);
  app.get('/appbg/product/edit/:id/:lan', view.toedit);
  app.post('/appbg/product/del', view.delproduct);
  app.post('/appbg/product/delall/:lan', view.delall);
  app.post('/appbg/product/sale/:lan', view.sale);
  app.post('/appbg/product/discount/:lan', view.discount);
  app.post('/appbg/product/uploadmovies/:lan', view.uploadmovies);
};
