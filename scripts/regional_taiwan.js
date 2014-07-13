var config = require('../config');
    MongoClient = require('mongodb'),
    mongojs = require('mongojs'),
    db = mongojs(config.dbinfo.dbname),
    dbregional = db.collection('regional'),
    xlsx = require('node-xlsx');
// 将中国地省市县数据导入到mongodb中
var load_regional = function() {
  var objs = xlsx.parse(__dirname+"/regional_taiwan.xlsx").worksheets[0].data;
  for (var i=0; i<objs.length; i++) {
    var obj = objs[i];
    var data = {};
    data.prov  = obj[1].value || "";
    data.city  = "台灣省";
    data.county= obj[3].value || "";
    dbregional.insert(data, function(err, doc) {
      console.log(doc);
    });
  }
};
load_regional();
