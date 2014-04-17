// workerid index.js 员工号管理
var view = require('./view');

exports.register = function (app) {
  app.get('/appbg/workerid/:lan', view.objctrl);
  app.post('/appbg/workerid/addobj/:lan', view.objadd);
  app.post('/appbg/workerid/delobj/', view.objdel);
  app.post('/appbg/workerid/changestate/:userid', view.changestate);
  app.post('/appbg/workerid/delall/:lan', view.delall);
};
