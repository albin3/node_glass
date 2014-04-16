// workerid view.js
var model = require("./model");

/**
 * 模块主页
 */
exports.objctrl = function (req, res) {
  model.allobjs(req, function(err, docs) {
    if (err || docs.length === 0) {
      return res.render('workerid/index', { Title: "Worker ID Management", language: req.params.lan });
    }
    return res.render('workerid/index', { Title: "Worker ID Management", language: req.params.lan, objs: docs });
  });
};

/**
 * 删除指定指定项
 */
exports.objdel = function (req, res) {
  model.objdel(req.body.id, function(err) {
    if (err) {
      return res.end(JSON.stringify({ status: false }));
    }
    return res.end(JSON.stringify({ status: true }));
  });
};

/**
 * 删除所有项目
 */
exports.delall = function (req, res) {
  model.delall(req, function(ret) {
    return res.end(JSON.stringify(ret));
  });
};

/**
 * 改变状态
 */
exports.changestate = function (req, res) {
  model.changestate(req.params.userid, req.body, function(err, doc) {
    var state = "(封停)";
    if (err) {
      return res.end(JSON.stringify({ status: false, state: state }));
    }
    if (!req.body.disable) {
      state = "(正常)";
    }
    return res.end(JSON.stringify({ status: true, state: state }));
  });
};

/**
 * 增加一个项目
 */
exports.objadd = function (req, res) {
  model.objadd(req, function (ret) {
    return res.end(JSON.stringify(ret));
  });
};
