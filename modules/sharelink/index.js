// index.js sharelink
var view = require('./view');

exports.register = function (app) {
  app.get('/sharelink/news/:userid/:objid/:lan', view.sharenews);
  app.get('/sharelink/prod/:userid/:objid/:lan', view.shareprod);
  app.all('/sharelink/:userid/:lan', view.sharelink);
};

