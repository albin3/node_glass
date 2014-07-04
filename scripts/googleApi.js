var http_sync = require('./http-sync');
var urlencode = require('urlencode'),
    config    = require('../config'),
    MongoClient = require('mongodb'),
    mongojs = require('mongojs');
var db = mongojs(config.dbinfo.dbname);
var dbregional = db.collection('regional');
var dbstore = db.collection('store');
var xlsx = require('node-xlsx'),
    password_hash = require('password-hash');

var values = ["南投縣南投市復興路211號"];

for (var i=0; i<values.length; i++) {
  // Test GET request
  var req = http_sync.request({
    protocol: 'http',
    host: 'ditu.google.cn',
    path: '/maps/api/geocode/json' + '?address='+urlencode(values[i])+'&sensor=false&language=zh-tw'
  });

  var res = req.end();
  var rtn = JSON.parse(res.body.toString());
  console.log(rtn);
  if (rtn.status === "OK") {
    console.log(rtn.results[0].geometry.location);
  }
}

var http = require('http');
console.log("<<<<<<<<<<<<<<<<<<<<<<<<");
