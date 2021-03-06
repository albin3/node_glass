var http_sync = require('./http-sync');
var urlencode = require('urlencode'),
    config    = require('../config'),
    MongoClient = require('mongodb'),
    mongojs = require('mongojs'),
    db = mongojs(config.dbinfo.dbname);
var dbregional = db.collection('regional');
var dbstore = db.collection('store');
var xlsx = require('node-xlsx'),
    password_hash = require('password-hash');

var objs = xlsx.parse(__dirname+"/20140620_taiwan_essilor.xlsx").worksheets[0].data;
console.log(objs.length);
var i    = 290;
var test = false;
function func() {//objs.length
  var obj = objs[i];
  var storeObj = {};
  if (obj === undefined || obj[0] === undefined) {
   return;
  }
  storeObj.brand = "essilor";
  storeObj.class = "essilor";
  storeObj.name  = obj[1] ? obj[1].value : " ";
  storeObj.province  = obj[2] ? obj[2].value : " ";
  if (storeObj.province[storeObj.province.length-1] === "省") {
    storeObj.province = storeObj.province.slice(0, storeObj.province.length-1);
  }
  storeObj.municipality = obj[3] ? obj[3].value : " ";
  if (storeObj.municipality[storeObj.municipality.length-1] === "市") {
    storeObj.municipality = storeObj.municipality.slice(0, storeObj.municipality.length-1);
  }
  storeObj.area  = obj[4] ? obj[4].value : " ";
  if (storeObj.area[storeObj.area.length-1] === "县" || storeObj.area[storeObj.area.length-1] === "區") {
    storeObj.area = storeObj.area.slice(0, storeObj.area.length-1);
  }
  storeObj.address = obj[5] ? obj[5].value : " ";
  storeObj.telephone = obj[6] ? obj[6].value : " ";
  storeObj.onbussiness = " ";
  storeObj.lan = "traditional_tw";
  var req = http_sync.request({
    protocol: 'http',
    host: 'ditu.google.cn',
    path: '/maps/api/geocode/json' + '?address='+urlencode(storeObj.province+storeObj.municipality+storeObj.area+storeObj.address)+'&sensor=false&language=zh-tw'
  });
  var res = req.end();
  var rtn = {};
  rtn = JSON.parse(res.body.toString());
  console.log(rtn);
  if (rtn.status === "OK") {
    console.log(rtn.results[0].geometry.location);
    storeObj.gps = [rtn.results[0].geometry.location.lng, rtn.results[0].geometry.location.lat];
  } else {
    storeObj.gps = [0, 0];
  }
  if (test) {
    console.log(storeObj);
  } else {
    dbstore.insert(storeObj, function(err, doc){
      if (err) 
        console.log(err);
      else 
        console.log(doc);
    });
  }

  if (i<808) {
    i++;
    console.log("###");
    console.log(i+"/808");
    setTimeout(func, 3000);
  } else {
    console.log("$$$ complete");
  }
}

func();
