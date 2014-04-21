// post门店消息

var http=require('http');
var qs=require('querystring');
 
var post_data={
  numPerPage    : "20",
  pageNum       : "2",
  province      : "上海",
  municipality  : "上海",
  area          : "静安"
};//这是需要提交的数据
var content=qs.stringify(post_data);
 
var options = {
  host: 'localhost',
  port: 3006,
  path: '/appapi/store/simplified',
  method: 'POST',
  headers:{
  'Content-Type':'application/x-www-form-urlencoded',
  'Content-Length':content.length
  }
};
console.log("post options:\n",options);
console.log("content:",content);
console.log("\n");
 
var req = http.request(options, function(res) {
  console.log("statusCode: ", res.statusCode);
  console.log("headers: ", res.headers);
  var _data='';
  res.on('data', function(chunk){
     _data += chunk;
  });
  res.on('end', function(){
     console.log("\n--->>\nresult:",_data)
   });
});
 
req.write(content);
req.end(); 
