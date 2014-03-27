#include "IGtPush.h"
#include <iostream>
#include <cstdlib>
#include <node.h>
#include <v8.h>

DLL_EXTERN Result STDCALL pushInit(char *host, char *appKey, char *masterSecret);

using namespace std;
using namespace v8;

Handle<Value> SayHello(const Arguments& args) {
    HandleScope scope;
    return scope.Close(String::New("Hello world!"));
}

Handle<Value> soPushInit(const Arguments& args) {
    v8::String::Utf8Value param1(args[0]->ToString());
    v8::String::Utf8Value param2(args[1]->ToString());
    v8::String::Utf8Value param3(args[2]->ToString());
    string strAppId = string(*param1);
    string strAppKey = string(*param2);
    string strMasterSecret = string(*param3);
    int iResult = pushInit("http://sdk.open.api.igexin.com/apiex.htm", (char*)strAppId.c_str(), (char*)strMasterSecret.c_str());
    HandleScope scope;
    return scope.Close(Integer::New(iResult));
}

void init_Module(Handle<Object> target) {
    NODE_SET_METHOD(target, "SayHello", SayHello);
    NODE_SET_METHOD(target, "pushInit", soPushInit);
}

NODE_MODULE(gtpush, init_Module);           // 第一个参数必须与target_name一样

