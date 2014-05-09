// index.js sharelink
var view = require('./view');

exports.register = function (app) {
  app.get('/sharelink', view.sharepage);
  app.all('/sharelink/:userid/:lan', view.sharelink);
};


