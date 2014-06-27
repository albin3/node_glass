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

var objs = xlsx.parse(__dirname+"/20140620_taiwan_nikon.xlsx").worksheets[0].data;
var i=0;
dbstore.find({lan: "traditional_tw", class: "Nikon"}, function(err, docs) {
  for (i=0; i<docs.length; i++) {
    docs[i].address = objs[i][4].value;
    docs[i].province = objs[i][1].value;
    docs[i].municipality = objs[i][2].value;
    docs[i].area = objs[i][3].value;
    docs[i].telephone = objs[i][5].value;
    dbstore.update({_id: docs[i]._id}, docs[i], function(err, result) {
      console.log(err);
      console.log(docs[i]);
    });
  }
});
/*
 "_id" : ObjectId("53a7f3e1fbd09dfc0e7759c6"), "address" : "北屯區", "area" : "台中市", "brand" : "nikon", "class" : "Nikon", "gps" : [  119.33763410385,  26.091193711885 ], "lan" : "traditional_tw", "municipality" : "台灣省", "name" : "看見眼鏡公司", "onbussiness" : "9:00~18:00", "province" : "寶島眼鏡台南仁德店", "telephone" : "台中市北屯區中清路52號" }
 */
