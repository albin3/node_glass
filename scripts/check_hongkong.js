var http_sync = require('./http-sync');
var urlencode = require('urlencode'),
    config    = require('../config'),
    MongoClient = require('mongodb'),
    mongojs = require('mongojs');
var db = mongojs(config.dbinfo.dbname);
var dbstores  = db.collection('store');
var dbproduct = db.collection('product');

dbstores.find({lan: "traditional_tw", brand: "essilor"}, function(err, docs) {
  if (err || docs.length === 0) {
    return console.log("Can not find stores");
  }
  var stores   = [];
  var discount = [];
  for (var i=0; i<docs.length; i++) {
    stores.push(docs[i]._id.toString());
    var flag = false;
    if (i%2 === 1) 
      flag = true;
    discount.push(flag);
  }
  dbproduct.update({lan: "traditional_tw", brand: "essilor"}, {$set: {stores: stores, discount: discount}}, {multi: true}, function(err, msg) {
    return console.log(msg);
  });
});
