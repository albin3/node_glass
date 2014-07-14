#ifndef _I_GT_PUSH_H_
#define _I_GT_PUSH_H_

#ifdef __cplusplus
extern "C" {
#endif

#if defined(WIN32) || defined(_WIN32)
#	define STDCALL _stdcall
#	if defined(GTPUSHSDK_EXPORTS)
#		define DLL_EXTERN  __declspec(dllexport)
#	else
#		define DLL_EXTERN  __declspec(dllimport)
#	endif
#else
#	define DLL_EXTERN
#	define STDCALL
#endif

// 调用返回结果结构体：SUCCESS(成功)/FAILED(失败)
typedef enum result_t {
    SUCCESS = 0,
    FAILED = 1
} Result;

// 单个结果键值对结构体
typedef struct entry_t {
    char key[100];
    char value[1024];
} Entry;

// 推送结果结构体
typedef struct i_push_result_t {
    int size; // 结果中存在多少个Entry
    Entry entry[10];
} IPushResult;

// 基本消息结构体
typedef struct message_t {
    int isOffline;
    long offlineExpireTime;
    int priority;
} Message;

// 单个消息结构体
typedef struct single_message_t {
    Message msg;
} SingleMessage;

// CID列表消息结构体
typedef struct list_message_t {
    Message msg;
} ListMessage;

// 应用消息结构体
typedef struct app_message_t {
    Message msg;
    char **appIdList;
    int appIdListSize;
    char **phoneTypeList;
    int phoneTypeListSize;
    char **provinceList;
    int provinceListSize;
    char **tagList;
    int tagListSize;
} AppMessage;

// 推送目标结构体
typedef struct target_t {
    char *appId;
    char *clientId;
} Target;

// 模板类型枚举
typedef enum template_type_t { 
    Transmission, PopupTransmission, NotyPopLoad, Notification, Link 
} TemplateType; 

// 应用于IOS手机
typedef struct push_info_t { 
    char *actionLocKey;
    int badge;
    char *message;
    char *sound;
    char *payload;
    char *locKey;
    char *locArgs;
    char *launchImage;
} PushInfo;

// 基本模板结构体
typedef struct template_t {
    char *appId;
    char *appKey;
    PushInfo pushInfo;
} Template;

// 透传模板结构体
typedef struct transmission_template_t {
    Template t;
    int transmissionType;
    char *transmissionContent;
} TransmissionTemplate;

// 弹窗透传模板结构体
typedef struct popup_transmission_template_t {
    Template t;
    int transmissionType;
    char *transmissionContent;
    char *title;
    char *text;
    char *img;
    char *confirmButtonText;
    char *cancelButtonText;
} PopupTransmissionTemplate;

// 通知弹窗下载模板结构体
typedef struct noty_pop_load_template_t {
    Template t;
    char *notyIcon;
    char *logoUrl;
    char *notyTitle;
    char *notyContent;
    int isCleared;
    int isBelled;
    int isVibrationed;
    char *popTitle;
    char *popContent;
    char *popImage;
    char *popButton1;
    char *popButton2;
    char *loadIcon;
    char *loadTitle;
    char *loadUrl;
    int isAutoInstall;
    int isActived;
    char *androidMark;
    char *symbianMark;
    char *iphoneMark;
} NotyPopLoadTemplate;

// 通知模板结构体
typedef struct notification_template_t {
    Template t;
    int transmissionType;
    char *transmissionContent;
    char *text;
    char *title;
    char *logo;
    char *logoUrl;
	int isRing;
    int isVibrate;
	int isClearable;
} NotificationTemplate;

// 链接模板结构体
typedef struct link_template_t {
    Template t;
    char *text;
    char *title;
    char *logo;
    char *logoUrl;
	char *url;
    int isRing;
    int isVibrate;
	int isClearable;
} LinkTemplate;

// 功能：分页获取CID列表函数
// 参数：
//		size 返回的Target列表大小 [out]
//		page 分页数，从0开始 [in]
// 返回值：返回分页Target列表指针, 如果没有了返回NULL
typedef Target * (*ListProvider)(int *size, int page);

// 功能：释放CID列表资源函数
// 参数：
//		list 调用ListProvider时分配的Target列表资源
//		size 分配的Target列表大小
// 返回值：无
typedef void (*ReleaseList)(Target *list, int size);

// 功能：推送结果回调函数
// 参数：
//		result 推送结果 [out]
// 返回值：无
typedef void (*PushEventListener)(IPushResult result);

// 功能：推送初始化，程序运行前初始化一次即可
// 参数：
//		host 个推服务器URL [in]
//		appKey 个推申请应用的appKey [in]
//		masterSecret 个推申请应用的masterSecret [in]
// 返回：Result枚举, SUCCESS、FAILED
DLL_EXTERN Result STDCALL pushInit(char *host, char *appKey, char *masterSecret);

// 功能：初始化个推服务器鉴权
// 参数：无
// 返回：Result枚举, SUCCESS、FAILED
DLL_EXTERN Result STDCALL pushConnect();

// 功能：关闭个推服务器鉴权
// 参数：无
// 返回：Result枚举, SUCCESS、FAILED
DLL_EXTERN Result STDCALL pushClose();

// 功能：推送单条消息
// 参数：
//		msgData 单推消息结构体指针 [in]
//		templateData 模板结构体指针 [in]
//		templateType 模板类型 [in]
//		target 推送目标结构体指针 [in]
// 返回：推送结果数据
DLL_EXTERN IPushResult STDCALL pushMessageToSingle(SingleMessage *msgData, void *templateData, TemplateType templateType, Target *target);

// 功能：获取contentId，用于pushMessageToListA接口
// 参数：
//		msgData CID列表消息结构体指针 [in]
//		templateData 模板结构体指针 [in]
//		templateType 模板类型 [in]
//		contentId 用于返回contentId的指针 [out]
//		size 可存放contentId的大小 [in]
// 返回：Result枚举, SUCCESS、FAILED
// 注意：如果size小于返回的ID，则返回FAILED
DLL_EXTERN Result STDCALL getContentId(ListMessage *msgData, void *templateData, TemplateType templateType, char *contentId, int size);

// 功能：取消contentId
// 参数：
//		contentId 需要取消的contentId [in]
// 返回：Result枚举, SUCCESS、FAILED
DLL_EXTERN Result STDCALL cancelContentId(char *contentId);

// 功能：推送CID列表A
// 参数：
//		contentId 由getContentId返回的contentId [in]
//		targetList 需要推送的目标列表 [in]
//		size 目标列表中有多少个Target [in]
// 返回：Result枚举, SUCCESS、FAILED
DLL_EXTERN IPushResult STDCALL pushMessageToListA(char *contentId, Target *targetList, int size);

// 功能：推送CID列表B
// 参数：
//		msgData CID列表消息结构体指针 [in]
//		templateData 模板结构体指针 [in]
//		templateType 模板类型 [in]
//		provider 分页获取CID列表函数指针 [in]
//		release 释放CID列表资源函数指针 [in]
//		listener 推送结果回调函数函数指针 [in]
// 返回：无
DLL_EXTERN void STDCALL pushMessageToListB(ListMessage *msgData, void *templateData, TemplateType templateType, ListProvider provider, ReleaseList release, PushEventListener listener);

// 功能：推送应用消息
// 参数：
//		msgData 应用消息结构体指针 [in]
//		templateData 模板结构体指针 [in]
//		templateType 模板类型 [in]
// 返回：推送结果数据
DLL_EXTERN IPushResult STDCALL pushMessageToApp(AppMessage *msgData, void *templateData, TemplateType templateType);

// 功能：停止推送某个任务
// 参数：
//		contentId 需要停止推送的contentId [in]
// 返回：Result枚举, SUCCESS、FAILED
DLL_EXTERN Result STDCALL pushStop(char *contentId);

#ifdef __cplusplus
}
#endif

#endif
