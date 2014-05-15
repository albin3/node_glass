// 紫外线指数 model.js

var config  = require('../../config');
var mongojs = require('mongojs');
var pushlib = require('../pushlib/model');

var db = mongojs(config.dbinfo.dbname);
var ObjectID = require('mongodb').ObjectID;

exports.pushuvindex = function (req, callback) {
  var lan = req.params.lan;
  pushlib.AndroidPush.pushAll({lan: lan, content: "main/111/EssolorApp/"+req.body.pushtext, message: "message"});
  pushlib.ApplePush.pushAll({lan: lan, content: "main", message: "111", alert: req.body.pushtext});
  return callback({ret: 1});
};
