var config    = require('../config'),
    MongoClient = require('mongodb'),
    mongojs = require('mongojs');
var db = mongojs(config.dbinfo.dbname);
var dbstore = db.collection('store');
    password_hash = require('password-hash');

function func() {
  dbstore.find(function(err, docs){
    for(var i=0; i<docs.length; i++) {
      console.log(docs[i].gps);
    }
    console.log("complete.")
  });
}

func();
