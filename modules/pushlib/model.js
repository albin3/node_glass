var apn = require('apn');
 
var token = 'c58a43e1f6e13f1dba47dde510ddffa27e2a0458b6607975c4232ea697577ba6'; //长度为64的设备Token
 
var options = { 
    "cert" : "./EssilorCer.pem",
    "key" : "./EssilorP12.pem",
    "gateway": "gateway.sandbox.push.apple.com",
    "port": 2195
     },
    apnConnection = new apn.Connection(options),
    device = new apn.Device(token),
    note = new apn.Notification();
 
note.expiry = Math.floor(Date.now() / 1000) + 60;
note.badge = 3;
note.alert = "动漫驿站 \n点击查看更新的1篇文章";
note.payload = {'messageFrom': 'Caroline'};
 
var a = apnConnection.pushNotification(note, device);

console.log(apnConnection);
console.log(device);
console.log(note);
console.log(a);
