var hello = require('./lib/build/Release/gtpush');

console.log(hello.SayHello());
var appId = "OlpSqUkkqy7cyonooHV0W9";
var appKey = "WsltddSVpc6sNIGw9xYWN2";
var masterSecret = "JoWWctCwtJAsDZVwy1XhU1";
console.log(hello.pushInit(appId, appKey, masterSecret));
// console.log(hello.PushInit());
