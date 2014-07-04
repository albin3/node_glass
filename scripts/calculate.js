var config    = require('../config'),
    MongoClient = require('mongodb'),
    mongojs = require('mongojs');
var db = mongojs("wine");
var dbtimes = db.collection('times');

var gt = 1398873600000;
var lt = 1398960000000;
/*
for (var i=0; i<31; i++) {
  gt += 24*3600*1000;
  lt += 24*3600*1000;
  console.log("from: " + gt + " to " + lt);
  dbtimes.count({dt: {$gt: gt, $lt: lt}}, function(err, count){
    if (err) {
      console.log(err);
      return ;
    }
    return console.log("be visited " + count + " times");
  });
}
*/
var count = new Array();
for (var i=0; i<61; i++) {
  count.push(0);
}
dbtimes.find({}, function(err, docs) {
  for (var i=0; i<docs.length; i++) {
    var day = Math.floor((docs[i].dt-gt)/(24*3600*1000));
    if (day < 0) 
      day = 0;
    count[day] ++;
  }
  console.log(count);
  var sum = 0;
  for (var i=0; i<count.length; i++) {
    sum += count[i];
  }
  console.log(sum);
});

