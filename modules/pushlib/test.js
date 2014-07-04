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

// model.AndroidPush.pushSingle();
// model.AndroidPush.pushLt();
// {lan: lan, content: "main/111/EssolorApp/"+req.body.pushtext, message: "message"}
// model.AndroidPush.pushAll({lan: "traditional_hk", content: "main/111/EssolorApp/hongkong", alert: "hello"});
model.AndroidPush.pushAll({lan: "traditional_tw", content: "main/111/EssolorApp/hongkong", alert: "hello"});
// model.AndroidPush.pushAll({lan: "simplified", content: "main/111/EssolorApp/今天紫外线指数有点高，出门注意防晒", alert: "hello"});


