var model = require('./model');

var cltid = "c58a43e1f6e13f1dba47dde510ddffa27e2a0458b6607975c4232ea697577ba6";
var msg = {
alert: "猛戳有奖 \n猛戳这里"
};
var msg1 = {
alert: "猛戳\n这里"
};

// model.ApplePush.pushSingle(cltid, msg);
// model.ApplePush.pushList([cltid], msg1);

model.AndroidPush.pushSingle();
model.AndroidPush.pushList();
model.AndroidPush.pushAll();
