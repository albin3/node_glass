var apn = require('apn');
var gtpush = require('./gtpush/lib/build/Release/gtpush');

var config   = require('../../config');
var mongojs  = require('mongojs');
var db       = mongojs(config.dbinfo.dbname);
var dbdevice = db.collection("deviceid");
var ObjectID = require('mongodb').ObjectID;
 
var ApplePush   = {};
var AndroidPush = {};

// Apple 推送接口
var options = { 
  "cert"   : config.appPath() + "/modules/pushlib/EssilorCer.pem",
  "key"    : config.appPath() + "/modules/pushlib/EssilorP12.pem",
  "gateway": "gateway.sandbox.push.apple.com",
  "port"   : 2195
};
var apnConnection = new apn.Connection(options);

apnConnection.on('connected', function() {
    console.log("Apns Connected");
});
apnConnection.on('transmitted', function(notification, device) {
    console.log("Apns Notification transmitted to:" + device.token.toString('hex'));
});
apnConnection.on('transmissionError', function(errCode, notification, device) {
    console.error("Apns Notification caused error: " + errCode + " for device ", device, notification);
});
apnConnection.on('timeout', function () {
    console.log("Apns Connection Timeout");
});
apnConnection.on('disconnected', function() {
    console.log("Apns Disconnected from APNS");
});
apnConnection.on('socketError', console.error);
ApplePush = {
pushSingle  : function(cltid, msg) {                // 推送单个用户
  var token = cltid;

  var device = new apn.Device(token),
      note = new apn.Notification();

  note.expiry = Math.floor(Date.now() / 1000) + 60;
  note.badge = 1;
  note.alert = msg.alert;
  note.payload = {'messageFrom': 'Caroline'};

  apnConnection.pushNotification(note, device);
  },
pushList    : function(cltlist, msg) {              // 推送用户列表
  var device = new Array();
  for(var i=0; i<cltlist.length; i++) {
    device.push(new apn.Device(cltlist[i]));
  }
  var note = new apn.Notification();

  note.expiry = Math.floor(Date.now() / 1000) + 60;
  note.badge = 3;
  note.alert = msg.alert;
  note.payload = {'messageFrom': 'Caroline'};

  apnConnection.pushNotification(note, device);
  },
pushAll     : function(msg) {                       // 推送所有用户
  dbdevice.find({lan: msg.lan, os: "IOS"}, function(err, docs){
    console.log(docs);
    if (err || docs.length === 0) {
      return;
    }
    var device = new Array();
    for(var i=0; i<docs.length; i++) {
      device.push(new apn.Device(docs[i].deviceid));
    }
    var note = new apn.Notification();
 
    note.expiry  = Math.floor(Date.now() / 1000) + 60;
    note.badge   = 1;
    note.alert   = msg.alert;
    note.sound   = "ping.aiff";
    note.payload = { 'page' : msg.content, 'id': msg.message };
 
    for (var i=0; i<device.length; i++) {
      apnConnection.pushNotification(note, device[i]);
    }
  });
  }
};

// Android 推送接口

// 初始化个推，参数分别为AppId，AppKey，MasterSecuret
console.log(gtpush.pushInit("OlpSqUkkqy7cyonooHV0W9", "WsltddSVpc6sNIGw9xYWN2", "JoWWctCwtJAsDZVwy1XhU1"));

AndroidPush = {
pushSingle  : function(cltid, msg) {                // 推送单个用户
  console.log(gtpush.pushSingle());
  },
pushList    : function(cltlist, msg) {              // 推送List用户
  console.log(gtpush.pushList());
  },
pushAll     : function(msg) {                       // 推送给所有用户
  console.log(gtpush.pushAll(msg.content, msg.message));
  }
};

exports.ApplePush   = ApplePush;
exports.AndroidPush = AndroidPush;
