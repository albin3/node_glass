// index.js sharelink
var view = require('./view');

exports.register = function (app) {
  app.get('/sharelink/:userid/:page/:param/:lan', view.sharepage);
  app.post('/sharelink/:userid/:lan', view.sharelink);
};


