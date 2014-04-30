// post门店消息

var http=require('http');
var qs=require('querystring');

for(var i=0;i<1000;i++){
var post_data={
  title: '新闻标题'+i,
  summary:'这里是简介这里是简介'+i
};//这是需要提交的数据
var content=qs.stringify(post_data);
 
var options = {
  host: 'localhost',
  //host: 'http://183.61.111.195/',
  port: 3006,
  path: '/appbg/news/add/simplified',
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
}