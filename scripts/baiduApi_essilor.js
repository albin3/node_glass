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

function func() {

console.log("start to get baidu api.");
var objs = xlsx.parse(__dirname+"/20140424.xlsx").worksheets[0].data;
for (var i=0; i<objs.length; i++) {
  var obj = objs[i];
  var storeObj = {};
  if (obj === undefined || obj[0] === undefined) {
   continue;
  }
  storeObj.brand = obj[0] ? obj[0].value : " ";
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
  if (storeObj.area[storeObj.area.length-1] === "县" || storeObj.area[storeObj.area.length-1] === "区") {
    storeObj.area = storeObj.area.slice(0, storeObj.area.length-1);
  }
  storeObj.address = obj[5] ? obj[5].value : " ";
  storeObj.telephone = obj[6] ? obj[6].value : " ";
  storeObj.onbussiness = obj[7] ? obj[7].value : " ";
  storeObj.lan = "simplified";
  var req = http_sync.request({
    protocol: 'http',
    host: 'api.map.baidu.com',
    path: '/geocoder/v2/' + '?address='+urlencode(storeObj.province+storeObj.municipality+storeObj.area+storeObj.address)+'&output=json&ak=uPcvBuG2dlnPlP2wKPfr4Tk2&callback=showLocation'
  });
  var res = req.end();
  var str = res.body.toString();
  var index1 = str.indexOf("(");
  var index2 = str.indexOf(")");
  var rtn = JSON.parse(res.body.toString().slice(index1+1, index2));
  if (rtn.status === 0) {
    storeObj.gps = [rtn.result.location.lng, rtn.result.location.lat];
  } else {
    storeObj.gps = [0, 0];
  }
  dbstore.save(storeObj, function(err, doc){
    if (err) 
      console.log(err);
    else 
      console.log(doc);
  });
}

var values = ["徐家汇", "人民广场", "中山公园", "宜山路", "漕河泾开发区", "张江高科", "佘山", "泗泾", "杨高中路", "国权路"];

for (var i=0; i<values.length; i++) {
  // Test GET request
  var req = http_sync.request({
    protocol: 'http',
    host: 'api.map.baidu.com',
    path: '/geocoder/v2/' + '?address='+urlencode(values[i])+'&output=json&ak=uPcvBuG2dlnPlP2wKPfr4Tk2&callback=showLocation'
  });

  var res = req.end();
  var str = res.body.toString();
  var index1 = str.indexOf("(");
  var index2 = str.indexOf(")");
  var rtn = JSON.parse(res.body.toString().slice(index1+1, index2));
  if (rtn.status === 0) {
    console.log(rtn.result.location.lng);
    console.log(rtn.result.location.lat);
  }
}

var http = require('http');
console.log("<<<<<<<<<<<<<<<<<<<<<<<<");
}

setTimeout(func, 10000);


