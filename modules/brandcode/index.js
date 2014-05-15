// brandcode index.js
var view = require('./view');

exports.register = function (app) {
  app.get('/appbg/brandcode/:lan', view.brandcode);
  app.post('/appbg/brandcode/paged/:lan', view.getBrandCodes);
  app.post('/appbg/brandcode/delone', view.delone);
  app.post('/appbg/brandcode/delall/:lan', view.delall);
};
