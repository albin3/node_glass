var http_sync = require('./http-sync');
var urlencode = require('urlencode'),
    config    = require('../config'),
    MongoClient = require('mongodb'),
    mongojs = require('mongojs');
var db = mongojs(config.dbinfo.dbname);
var dbrandom = db.collection('random');

dbrandom.update({}, {$set: {random: Math.random()}}, function(err, doc){
  if (err) {
    console.log("产生随机数出错");
  } else {
    console.log("产生随机数成功");
  }
  db.close();
});
