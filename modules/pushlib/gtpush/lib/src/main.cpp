#include "IGtPush.h"
#include <iostream>
#include <cstdlib>

using namespace std;

static void printResult(IPushResult &result);

Target *MyListProvider(int *size, int page) {
    Target *list = NULL;
    if (page == 0) {
        *size = 2;
        list = (Target *)malloc(sizeof(Target) **size);
        
        Target *target = list + 0;
        target->appId = "aK6jeksP5C7CsjSSEqLAA3";
        target->clientId = "e8f0713b86008b25d4d71210299d5c0f";
        
        target = list + 1;
        target->appId = "aK6jeksP5C7CsjSSEqLAA3";
        target->clientId = "00b4afe57239c5511d02bbfabb10ddba";
    } else if (page == 1) {
        *size = 1;
        list = (Target *)malloc(sizeof(Target) **size);
        Target *target = list + 0;
        target->appId = "aK6jeksP5C7CsjSSEqLAA3";
        target->clientId = "e8f0713b86008b25d4d71210299d5c0f";
    }
    
    cout << "MyListProvider(" << *size << ", " << page << ")=" << list << endl;
    
    return list;
}

void MyReleaseList(Target *list, int size) {
    cout << "MyReleaseList(" << list << ")" << endl;
    free(list);
}


void MyPushEventListener(IPushResult result) {
    printResult(result);
}

int main(int argc, char **argv) {
    char *appId = "OlpSqUkkqy7cyonooHV0W9";
    char *appKey = "WsltddSVpc6sNIGw9xYWN2";
    char *masterSecret = "JoWWctCwtJAsDZVwy1XhU1";
    pushInit("http://sdk.open.api.igexin.com/apiex.htm", appKey, masterSecret);
   
    Message msg = {0};
    msg.isOffline = 1;
    msg.offlineExpireTime = 1000;
    msg.priority = 1;
    
    SingleMessage singleMsg = {0};
    singleMsg.msg = msg;
    
    ListMessage listMsg = {0};
    listMsg.msg = msg;
    
    AppMessage appMsg = {0};
    appMsg.msg = msg;
    char *appIdList[] = {"OlpSqUkkqy7cyonooHV0W9"};
    appMsg.appIdList = appIdList;
    appMsg.appIdListSize = 1;
    char *phoneTypeList[] = {"android"};
    appMsg.phoneTypeList = phoneTypeList;
    appMsg.phoneTypeListSize = 1;
    char *provinceList[] = {"zhejiang", "shanghai"};
    appMsg.provinceList = provinceList;
    appMsg.provinceListSize = 2;
    char *tagList[] = {"测试", "tags"};
    appMsg.tagList = tagList;
    appMsg.tagListSize = 2;
    
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
    
    Target target = {0};
    target.appId = appId;
    target.clientId = "5d04457257f3271cea28cf74de24cb1c";
    
    IPushResult result = {0};
    Result ret;
    char contentId[100] = {0};
    
    for (int i = 0; i < 1; i++) {
        cout << "============pushMessageToSingle============" << endl;
        result = pushMessageToSingle(&singleMsg, &templ, Transmission, &target);
        printResult(result);
    }
    
    cout << "============getContentId============" << endl;
    ret = getContentId(&listMsg, &templ, Transmission, contentId, sizeof(contentId));
    cout << "getContentId ret=" << ret << " " << contentId << endl;
    if (ret == SUCCESS) {
        Target targetList[1] = {0};
        targetList[0].appId = appId;
        targetList[0].clientId = "5d04457257f3271cea28cf74de24cb1c";
        cout << "============pushMessageToListA============" << endl;
        result = pushMessageToListA(contentId, targetList, 2);
        printResult(result);
    
        cout << "============cancelContentId============" << endl;
        ret = cancelContentId(contentId);
        cout << "cancelContentId ret=" << ret << endl;
    }
    
    cout << "============pushMessageToApp============" << endl;
    result = pushMessageToApp(&appMsg, &templ, Transmission);
    printResult(result);
    
    cout << "============pushStop============" << endl;
    ret = SUCCESS;// pushStop(contentId);
    cout << "pushStop ret=" << ret << endl;
    
    cout << "============pushMessageToListB============" << endl;
    pushMessageToListB(&listMsg, &templ, Transmission, MyListProvider, MyReleaseList, MyPushEventListener);
}

static void printResult(IPushResult &result) {
    cout << "print result:-------------" << endl;
    for (int i = 0; i < result.size; i++) {
        cout << result.entry[i].key << ": " << result.entry[i].value << endl;
    }
    cout << "print end:----------------" << endl;
}

