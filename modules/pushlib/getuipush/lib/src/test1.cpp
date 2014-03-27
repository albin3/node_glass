#include "IGtPush.h"
#include <iostream>
#include <cstdlib>

using namespace std;

static void printResult(IPushResult &result);

int main(int argc, char **argv) {
    char *appId = "OlpSqUkkqy7cyonooHV0W9";
    char *appKey = "WsltddSVpc6sNIGw9xYWN2";
    char *masterSecret = "JoWWctCwtJAsDZVwy1XhU1";
    pushInit("http://sdk.open.api.igexin.com/apiex.htm", appKey, masterSecret);
   
    Message msg = {0};
    msg.isOffline = 1;
    msg.offlineExpireTime = 1000;
    msg.priority = 1;
    
    AppMessage appMsg = {0};
    appMsg.msg = msg;
    char *appIdList[] = {"OlpSqUkkqy7cyonooHV0W9"};
    appMsg.appIdList = appIdList;
    appMsg.appIdListSize = 1;
    char *phoneTypeList[] = {};
    appMsg.phoneTypeList = phoneTypeList;
    appMsg.phoneTypeListSize = 0;
    char *tagList[] = {};
    appMsg.tagList = tagList;
    appMsg.tagListSize = 0;
    
    TransmissionTemplate templ = {0};
    templ.transmissionContent = "d透传消息内容d";
    templ.transmissionType = 1;
    templ.t.appId = appId;
    templ.t.appKey = appKey;
    templ.t.pushInfo.actionLocKey = "actionLocKey";
    templ.t.pushInfo.badge = 1;
    templ.t.pushInfo.launchImage = "launchImage";
    templ.t.pushInfo.locArgs = "locArgs";
    //templ.t.pushInfo.locKey = "locKey";
    templ.t.pushInfo.message = "测试消息";
    templ.t.pushInfo.payload = "payload";
    templ.t.pushInfo.sound = "sound";
    
    IPushResult result = {0};
    
    cout << "============pushMessageToApp============" << endl;
    result = pushMessageToApp(&appMsg, &templ, Transmission);
    printResult(result);
}

static void printResult(IPushResult &result) {
    cout << "print result:-------------" << endl;
    for (int i = 0; i < result.size; i++) {
        cout << result.entry[i].key << ": " << result.entry[i].value << endl;
    }
    cout << "print end:----------------" << endl;
}

