var config = require('../../config');
var mongojs = require('mongojs');

var db = mongojs(config.dbinfo.dbname);
var dbs = db.collection('regional');
var ObjectID = require('mongodb').ObjectID;

dbs.find({}, function(err,docs){
    if (err) {
      callback({ret: 2});                           // RETURN: 数据库出错
    }
    var province = new Array();
    for(var i=0;i<docs.length;i++){
    	if(province.indexOf('<option>'+docs[i].city+'</option>')===-1){
    		province.push('<option>'+docs[i].city+'</option>');
            console.log(docs[i].city);
    	}   	
    }                // RETURN: 返回成功
    console.log(province);
  });