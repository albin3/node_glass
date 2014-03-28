var http_sync = require('./http-sync/http-sync');

var values = ["徐家汇", "人民广场", "中山公园", "宜山路", "漕河泾开发区", "张江高科", "佘山", "泗泾", "杨高中路", "国权路"];

for (var i=0; i<values.length; i++) {
  // Test GET request
  var req = http_sync.request({
    protocol: 'http',
    host: 'api.map.baidu.com',
    // path: '/geocoder/v2/' + '?address=%E5%BE%90%E5%AE%B6%E6%B1%87&output=json&ak=uPcvBuG2dlnPlP2wKPfr4Tk2&callback=showLocation'
    path: '/geocoder/v2/' + '?address='+values[i].toString("UTF8")+'&output=json&ak=uPcvBuG2dlnPlP2wKPfr4Tk2&callback=showLocation'
  });

  console.log(values[i].toString('UTF8'));
  var res = req.end();
  console.log("it comes >>>>>>>>>>>>>" + i);
  console.log(res.body.toString());
}


var http = require('http');
console.log("<<<<<<<<<<<<<<<<<<<<<<<<");
http.request('http://api.map.baidu.com/geocoder/v2/', function(err, res){
    });
