var config = require('../config');
    MongoClient = require('mongodb'),
    mongojs = require('mongojs'),
    db = mongojs(config.dbinfo.dbname),
    dbregional = db.collection('regional'),
    xlsx = require('node-xlsx');
// 导入地区信息
var load_regional = function() {
  var objs = xlsx.parse(__dirname+"/regional.xlsx").worksheets[0].data;
  for (var i=0; i<objs.length; i++) {
    var obj = objs[i];
    if (typeof obj[4].value !== "number" || obj[4].value !== 2) {
      continue;
    }
    var data = {};
    data.index = obj[0].value;
    data.prov  = obj[1].value;
    if (data.prov[data.prov.length-1] === "省") {
      data.prov = data.prov.slice(0, data.prov.length-1);
    }
    data.city  = obj[2].value;
    if (data.city[data.city.length-1] === "市") {
      data.city = data.city.slice(0, data.city.length-1);
    }
    data.county= obj[3].value;
    dbregional.insert(data, function(err, doc) {
    });
  }
};
load_regional();
