// brandcode model.js
var config = require("../../config"); // 为了获取到路径
var qureystring = require("querystring");

var mongojs = require('mongojs');
var db = mongojs(config.dbinfo.dbname);
var dbbrandcode = db.collection('brandcode');
var ObjectID = require('mongodb').ObjectID;

// 分页获取产品识别码信息
exports.getBrandCodes = function(query, callback) {
  dbbrandcode.find({lan: query.lan}).sort({lan: 1, code: 1}).skip((query.skip-1)*query.limit).limit(query.limit, function(err, docs){
    if (err) 
      return callback({ret: 2, val: []});
    else 
      return callback({ret: 1, val: docs});
  });
};

// 获取分页总数
exports.getPages = function(data, callback) {
  var perPage = data.perPage;
  var lan     = data.lan;
  dbbrandcode.count({lan: lan}, function(err, num) {
    if (err) {
      return callback(1);
    }
    return callback(Math.ceil(num/perPage));
  });
};

// 根据语言删除所有
exports.delall = function(req, callback) {
  if (!req.body.id || req.body.id.length < 24) {
    req.body.id = "ffffffffffffffffffffffff";
  }
  dbbrandcode.remove({lan: req.params.lan}, function(err) {
    if (err) {
      return callback({ret: 2});
    }
    return callback({ret: 1});
  });
};

// 根据删除单条记录
exports.delone = function(req, callback) {
  dbbrandcode.remove({_id: new ObjectID(req.body.id)}, function(err) {
    if (err) {
      return callback({ret: 2});
    }
    return callback({ret: 1});
  });
};

