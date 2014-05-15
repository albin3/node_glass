// brandcode view.js
var model = require("./model");

exports.brandcode = function(req, res) {
  var query = {
    lan   : req.params.lan,
    limit : 20,
    skip  : 1
  };
  model.getBrandCodes(query, function(ret) {
    if (ret.ret !== 1) {
      return res.render('brandcode/index', {Title: "Brand Code", language: req.params.lan, objs: [], totalPages: 0});
    }
    model.getPages({perPage: 20, lan: req.params.lan}, function(totalPages) {
      return res.render('brandcode/index', {Title: "Brand Code", language: req.params.lan, objs: ret.val, totalPages: totalPages});
    });
  });
};

// 分页获取产品识别码
exports.getBrandCodes = function(req, res) {
  var query = {
    lan   : req.params.lan             || "simplified",
    skip  : parseInt(req.body.page)    || 1,
    limit : parseInt(req.body.perPage) || 20
  };
  model.getBrandCodes(query, function(ret) {
    return res.end(JSON.stringify(ret));
  });
};

// 删除所有
exports.delall = function (req, res) {
  model.delall(req, function(ret) {
    res.end(JSON.stringify(ret));
  });
};

// 删除一个产品标识码
exports.delone = function (req, res) {
  model.delone(req, function(ret) {
    res.end(JSON.stringify(ret));
  });
};
