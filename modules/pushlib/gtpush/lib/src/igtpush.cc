#include <iostream>
#include <cstdlib>
#include <node.h>
#include <v8.h>
#include "IGtPush.h"
using namespace std;
using v8::Value;
using v8::Object;
using v8::Handle;
using v8::HandleScope;
using v8::String;
using v8::Integer;
using v8::Arguments;

// 全局变量，存储个推的四个数据
string strAppId        = "";
string strAppKey       = "";
string strAppSecret    = "";
string strMasterSecret = "";

// printResult
static void printResult(IPushResult &result) {
    cout << "print result:-------------" << endl;
    for (int i = 0; i < result.size; i++) {
        cout << result.entry[i].key << ": " << result.entry[i].value << endl;
    }
    cout << "print end:----------------" << endl;
}

Handle<Value> SayHello(const Arguments& args) {
    HandleScope scope;
    return scope.Close(String::New("Hello world!"));
}

// 初始化个推
Handle<Value> soPushInit(const Arguments& args) {
    v8::String::Utf8Value param1(args[0]->ToString());
    v8::String::Utf8Value param2(args[1]->ToString());
    v8::String::Utf8Value param3(args[2]->ToString());
    strAppId = string(*param1);
    strAppKey = string(*param2);
    strMasterSecret = string(*param3);
    int iResult = pushInit("http://sdk.open.api.igexin.com/apiex.htm", (char*)strAppKey.c_str(), (char*)strMasterSecret.c_str());
    HandleScope scope;
    return scope.Close(Integer::New(iResult));
}

// 对单个用户推送
Handle<Value> soPushSingle(const Arguments& args) {
    HandleScope scope;
    return scope.Close(Integer::New(1));
}

// 对列表用户推送
Handle<Value> soPushList(const Arguments& args) {
    HandleScope scope;
    return scope.Close(Integer::New(2));
}

// 对所有用户推送
Handle<Value> soPushAll(const Arguments& args) {
    v8::String::Utf8Value param1(args[0]->ToString());
    v8::String::Utf8Value param2(args[1]->ToString());
    string strContent = string(*param1);
    string strMessage = string(*param2);

    Message msg = { 0 };
    msg.isOffline = 1;
    msg.offlineExpireTime = 1000;
    msg.priority = 1;
    
    AppMessage appMsg = {0};
    appMsg.msg = msg;
    char *appIdList[] = { (char*)strAppId.c_str() };        // 传入的AppId
    appMsg.appIdList = appIdList;
    appMsg.appIdListSize = 1;
    char *phoneTypeList[] = { };
    appMsg.phoneTypeList = phoneTypeList;
    appMsg.phoneTypeListSize = 0;
    char *tagList[] = {};
    appMsg.tagList = tagList;
    appMsg.tagListSize = 0;
    
    TransmissionTemplate templ = {0};
    templ.transmissionContent = (char*)strContent.c_str();         // 传入的消息内容
    templ.transmissionType = 1;
    templ.t.appId = (char*)strAppId.c_str();                // 全局变量
    templ.t.appKey = (char*)strAppKey.c_str();              // 全局变量
    templ.t.pushInfo.actionLocKey = "actionLocKey";
    templ.t.pushInfo.badge = 1;
    templ.t.pushInfo.launchImage = "launchImage";
    templ.t.pushInfo.locArgs = "locArgs";
    //templ.t.pushInfo.locKey = "locKey";
    templ.t.pushInfo.message = (char*)strMessage.c_str();          // 传入的信息
    templ.t.pushInfo.payload = "payload";
    templ.t.pushInfo.sound = "sound";
    
    IPushResult result = {0};
    
    result = pushMessageToApp(&appMsg, &templ, Transmission);
    printResult(result);
    HandleScope scope;
    return scope.Close(Integer::New(3));  // TODO: 返回调用结果
}

void init_Module(Handle<Object> target) {
    NODE_SET_METHOD(target, "SayHello", SayHello);
    NODE_SET_METHOD(target, "pushInit", soPushInit);
    NODE_SET_METHOD(target, "pushSingle", soPushSingle);
    NODE_SET_METHOD(target, "pushList", soPushList);
    NODE_SET_METHOD(target, "pushAll", soPushAll);
}

NODE_MODULE(gtpush, init_Module);           // 第一个参数必须与target_name一样

