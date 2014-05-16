// appapi model.js
var config = require('../../config');
var plist   = require('plist');
var mongojs = require('mongojs');
var password_hash = require('password-hash');
var db = mongojs(config.dbinfo.dbname);

var db_user         = db.collection('appuser');
var db_appversion   = db.collection('appversion');    // android version
var db_appleversion = db.collection('appleversion');  // apple version
var db_androidscore = db.collection('androidscore');  // android score
var db_news         = db.collection('news');
var db_workerid     = db.collection('workerid');
var db_uvcatcher    = db.collection('uvcatcher');     // Games
var db_findglass    = db.collection('findglass');     // Games
var db_findglasspic = db.collection('findglasspic');  // Games
var db_coupon       = db.collection('coupon');
var db_pra_coupon   = db.collection('couponpravided');
var db_regional     = db.collection('regional');
var db_store        = db.collection('store');
var db_slide        = db.collection('slide');
var db_brand        = db.collection('brand');
var db_product      = db.collection('product');
var db_tips         = db.collection('tips');
var db_random       = db.collection('random');
var db_usercoupon   = db.collection('usercoupon');
var db_deviceid     = db.collection('deviceid');
var db_brandcode    = db.collection('brandcode');
var ObjectID        = require('mongodb').ObjectID;

// Date的format方法
Date.prototype.format = function(format) {
  var date = {
    "M+": this.getMonth() + 1,
    "d+": this.getDate(),
    "h+": this.getHours(),
    "m+": this.getMinutes(),
    "s+": this.getSeconds(),
    "q+": Math.floor((this.getMonth() + 3) / 3),
    "S+": this.getMilliseconds()
  };
  if (/(y+)/i.test(format)) {
    format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  for (var k in date) {
    if (new RegExp("(" + k + ")").test(format)) {
      format = format.replace(RegExp.$1, RegExp.$1.length == 1
        ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
    }
  }
  return format;
}

/**
 * 新用户注册
 */
exports.newuser = function (user, callback) {
  if (user.tel === undefined && user.email === undefined && user.thirdpath === undefined) {
    return callback({ret: 4});                  // RETURN: 没有关键字段
  }
  if (!user.workerid) {     // 初始化
    user.workerid = "";
  }
  // 验证员工号码
  user.isworker = 0;
    db_workerid.findOne({index: user.workerid.toUpperCase()}, function (err, doc) {
      if (err || !doc) {
        if (user.workerid !== undefined && user.workerid !== ""){
          return callback({ret: 3});            // RETURN: 员工Id验证错误 
        }
      } else {
        user.isworker = parseInt(doc.level);// 用户可能分等级
      }
      // 插入数据库
      user.password = user.password || "111111";
      user.password = password_hash.generate(user.password);
      user.disable  = false;
      user.sharenum = 0;      // 分享链接的次数
      user.clicknum = 0;      // 链接点击的次数
      user.name     = "";
      user.sex      = "";
      user.age      = "";
      user.job      = "";
      user.location = "";
      user.workerid = "";
      db_user.insert(user, function (err, doc) {
        if (err) {
          return callback({ret: 2});             // RETURN: 注册字段重复
        }
        var val = {
          userid   : doc._id.toString(),
          isworker : doc.isworker,
          name     : doc.name,
          sex      : doc.sex,
          age      : doc.age,
          job      : doc.job,
          nickname : doc.nickname,
          workerid : doc.workerid,
          location : doc.location
        };
        if (doc.tel) {
          val.tel = doc.tel;
        }
        if (doc.email) {
          val.email = doc.email;
        }
        if (doc.thirdpath) {
          val.thirdpath = doc.thirdpath;
        }
        return callback({                        // RETURN: 注册成功
          ret      : 1, 
          val      : val
        });
      });
    });
};

/**
 * 用户登录
 */
exports.usersignin = function (user, callback) {
  var query = {};
  switch (parseInt(user.type)) {
    case 1:  query.tel = user.name;
             break;
    case 2:  query.email = user.name;
             break;
    case 3:  query.thirdpath = user.name;
             break;
    default: query.tel = user.name;
             break;
  }
  db_user.findOne(query, function(err, doc){
    if (parseInt(user.type) === 3){
      if (!err && doc) {                        // RETURN: 第三方账号已存在
        var val = {
          userid   : doc._id.toString(),
          isworker : doc.isworker,
          name     : doc.name,
          sex      : doc.sex,
          age      : doc.age,
          job      : doc.job,
          nickname : doc.nickname,
          workerid : doc.workerid,
          location : doc.location
        };
        if (doc.tel) {
          val.tel = doc.tel;
        }
        if (doc.email) {
          val.email = doc.email;
        }
        if (doc.thirdpath) {
          val.thirdpath = doc.thirdpath;
        }
        return callback({
           ret      : 1,
           val      : val
        });
      }
      db_user.insert({
        nickname : user.password,
        thirdpath: user.name,
        name     : "",
        sex      : "",
        age      : "",
        job      : "",
        workerid : "",
        location : "",
        isworker : 0,
        disable  : false,
        sharenum : 0,      // 分享链接的次数
        clicknum : 0       // 链接点击的次数
      },function(err, doc){
        if (err || !doc) {
          return callback({ret: 5});          // RETURN: 查询出错
        }
        var val = {
          userid   : doc._id.toString(),
          isworker : doc.isworker,
          name     : doc.name,
          sex      : doc.sex,
          age      : doc.age,
          job      : doc.job,
          nickname : doc.nickname,
          workerid : doc.workerid,
          location : doc.location
        };
        if (doc.tel) {
          val.tel = doc.tel;
        }
        if (doc.email) {
          val.email = doc.email;
        }
        if (doc.thirdpath) {
          val.thirdpath = doc.thirdpath;
        }
        return callback({
           ret      : 1,
           val      : val
        });
      });
    } else {
      if (err || !doc) {
        return callback({ret: 4});         // RETURN: 账号不存在
      }
      if (doc.disable) {
        return callback({ret: 3});         // RETURN: 账号被停封
      }
      // 第三方登录不验证密码
      if (parseInt(user.type) !== 3 &&
          !password_hash.verify(user.password, doc.password)){
        return callback({ret: 2});         // RETURN: 账号密码不正确
      }
      var val = {
        userid   : doc._id.toString(),
        isworker : doc.isworker,
        name     : doc.name,
        sex      : doc.sex,
        age      : doc.age,
        job      : doc.job,
        nickname : doc.nickname,
        workerid : doc.workerid,
        location : doc.location
      };
      if (doc.tel) {
        val.tel = doc.tel;
      }
      if (doc.email) {
        val.email = doc.email;
      }
      if (doc.thirdpath) {
        val.thirdpath = doc.thirdpath;
      }
      return callback({                    // RETURN: 账号密码正确
        ret      : 1,
        val      : val
      });
    }
  });
};

/**
 * 邀请好友
 */
exports.invitefriend = function (user, callback) {
  var id = user.id;
  db_user.findOne({_id: new ObjectID(id)}, function(err, doc){
    if (err || !doc) {
      return callback({ret: 4});         // RETURN: 账号不存在
    }
    if (doc.disable) {
      return callback({ret: 3});         // RETURN: 账号被停封
    }
    if (user.tel) {
      doc.tel   = user.tel;
    }
    if (user.email) {
      doc.email = user.email;
    }
    db_workerid.findOne({index: user.workerid}, function(err, workerid){
      if (err||!workerid&&user.workerid) {
        return callback({ret: 6});      // RETURN: 员工身份码错误
      } else if (user.workerid){
        doc.isworker = 1;
        doc.workerid = user.workerid;
      }
      db_user.update({_id: new ObjectID(id)}, doc, function(err, updated){
        if(err) {
          return callback({ret: 5});       // RETURN: 数据库错误
        }
        var val = {
          userid   : doc._id.toString(),
          isworker : doc.isworker,
          name     : doc.name,
          sex      : doc.sex,
          age      : doc.age,
          job      : doc.job,
          nickname : doc.nickname,
          workerid : doc.workerid,
          location : doc.location
        };
        if (doc.tel) {
          val.tel = doc.tel;
        }
        if (doc.email) {
          val.email = doc.email;
        }
        if (doc.thirdpath) {
          val.thirdpath = doc.thirdpath;
        }
        return callback({ret : 1, val: val});        // RETURN: 更新成功
      });
    });

  });
};

/**
 * 修改用户密码
 */
exports.chpassword = function (user, callback) {
  var query = {};
  if (user.type === 1 || user.type === '1') {
    query.tel = user.username      ||"test";
  } else if (user.type === 2 || user.type === '2') {
    query.email = user.username    ||"test";
  } else {
    query.thirdpath = user.username||"test";
  }

  db_user.findOne(query, function(err, doc){
    if (err || !doc) {
      return callback({ret: 4});         // RETURN: 账号不存在
    }
    if (doc.disable) {
      return callback({ret: 3});         // RETURN: 账号被停封
    }
    if (false) { // (!password_hash.verify(user.oldpsd, doc.password)){
      return callback({ret: 2});         // RETURN: 账号密码不正确
    }

    doc.password = password_hash.generate(user.newpassword || user.newpsd || "111111");
    db_user.update(query, doc, function(err, updated){
      if(err) {
        return callback({ret: 5});       // RETURN: 数据库错误
      }
      var val = {
        userid   : doc._id.toString(),
        isworker : doc.isworker,
        name     : doc.name,
        sex      : doc.sex,
        age      : doc.age,
        nickname : doc.nickname,
        job      : doc.job,
        workerid : doc.workerid,
        location : doc.location
      };
      if (doc.tel) {
        val.tel = doc.tel;
      }
      if (doc.email) {
        val.email = doc.email;
      }
      if (doc.thirdpath) {
        val.thirdpath = doc.thirdpath;
      }
      return callback({                 // RETURN: 账号密码正确
             ret      : 1,
             val      : val
      });
    });
  });
};

/**
 * 重置用户密码
 */
exports.resetpassword = function (user, callback) {
  var query = {_id: new ObjectID(user.userid)};

  db_user.findOne(query, function(err, doc){
    if (err || !doc) {
      return callback({ret: 4});         // RETURN: 账号不存在
    }
    if (doc.disable) {
      return callback({ret: 3});         // RETURN: 账号被停封
    }

    var Num = "";
    for (var i = 0; i < 6; i++) {
      Num += Math.floor(Math.random()*10);
    }
    doc.password = password_hash.generate(Num);
    db_user.update(query, doc, function(err, updated){
      if(err) {
        return callback({ret: 5});                // RETURN: 数据库错误
      }
      return callback({                           // RETURN: 账号密码正确
             ret      : 1,
             userid   : doc._id.toString(),
             isworker : doc.isworker,
             password : Num
      });
    });
  });
};

/**
 * 修改用户信息
 */
exports.updateuser = function (req, callback) {
  var query = {_id: new ObjectID(req.params.userid)};
  var user = req.body;
  db_user.findOne(query, function(err, mid){
    if (err || !mid) {
      return callback({ret: 4});         // RETURN: 账号不存在
    }
    if (mid.disable) {
      return callback({ret: 3});         // RETURN: 账号被封停
    }
    
    mid.workerid = user.workerid || mid.workerid;
    mid.isworker = user.isworker || mid.isworker;
    db_workerid.find({index: mid.workerid}, function(err, doc){
      if (err) {
        return callback({ret: 4});       // RETURN: 账号不存在
      }
      if (doc && mid.workerid !== "") {
        mid.isworker = 1;
      } else {
        mid.isworker = 0;
      }
      mid.tel      = user.tel      || mid.tel;
      mid.email    = user.email    || mid.email;
      mid.thirdpath= user.thirdpath|| mid.thirdpath;
      if (!mid.tel) {
        delete mid.tel;
      }
      if (!mid.email) {
        delete mid.email;
      }
      if (!mid.thirdpath) {
        delete mid.thirdpath;
      }
      mid.sex      = user.sex      || mid.sex;
      mid.name     = user.name     || mid.name;
      mid.age      = user.age      || mid.age;
      mid.job      = user.job      || mid.job;
      mid.location = user.location || mid.location;
      db_user.update(query, mid, function(err, doc){
        if (err) {
          return callback({ret: 2});       // RETURN: 邮箱或手机号已经被使用
        }
        var val = {
          userid   : req.params.userid,
          isworker : mid.isworker,
          name     : mid.name,
          sex      : mid.sex,
          age      : mid.age,
          job      : mid.job,
          nickname : mid.nickname,
          workerid : mid.workerid,
          location : mid.location
        };
        if (doc.tel) {
          val.tel = mid.tel;
        }
        if (doc.email) {
          val.email = mid.email;
        }
        if (doc.thirdpath) {
          val.thirdpath = mid.thirdpath;
        }
        return callback({                  // RETURN: 修改成功
               ret      : 1,
               val      : val
        });
      });
    });
  });
};


// ###新闻接口
// 新闻列表
exports.pagednews = function (req, callback) {
  var numPerPage = parseInt(req.params.numPerPage);
  var pageNum = parseInt(req.params.pageNum);
  db_news.find({lan: req.params.lan}).sort({time: -1}).limit(numPerPage).skip(numPerPage*(pageNum-1), function(err, docs){
    if (err){
      return callback({ret: 2});                                //RETURN: 查询出错
    }
    for (var index=0; index<docs.length; index++) {
      docs[index]._id = docs[index]._id.toString();
      delete docs[index].details;
      delete docs[index].focus;
      delete docs[index].url;
      delete docs[index].lan;
      docs[index].pic = "/img/news/" + docs[index]._id + ".jpg";
    }
    return callback({ret: 1, num:docs.length, list: docs});      // RETURN: 返回成功
  });
};
// 新闻焦点图
exports.slide = function (req, callback) {
  num = req.params.num;
  db_slide.find({lan: req.params.lan}).limit(parseInt(num), function(err, docs){
    if (err){
      return callback({ret: 2});                                // RETURN: 查询出错
    }
    var listnum = 0;
    var imglist = new Array();
    for (var i=0; i<docs.length; i++) {
      imglist.push({
        _id   : docs[i]._id.toString(),
        title   : docs[i].title,
        summary : docs[i].summary,
        url     : docs[i].url,
        picture   : "/img/slide/" + docs[i]._id.toString() + ".jpg"
      });
      listnum += 1;
    }
    return callback({ret: 1, num: listnum, list: imglist});     // RETURN: 返回成功
  });
};
// 新闻详情
exports.newsdetails = function (req, callback) {
  var newsid = req.params.newsid;
  db_news.findOne({_id: new ObjectID(newsid)}, function(err, doc){
    if (err){
      return callback({ret: 3});                                // RETURN: 查询出错
    }
    if (!doc){
      return callback({ret: 2});                                // RETURN: 新闻已经已经被删除
    }

    doc._id = doc._id.toString();
    delete doc.url;
    doc.url = doc.firpicdes;
    delete doc.firpicdes;
    doc.listpic = "/img/news/"+doc._id+".jpg";
    return callback({ret: 1, obj: doc});                        // RETURN: 返回成功
  });
};

// ###游戏接口
// 紫外线收割机
exports.uvcatcher = function(req, callback) {
  var data     = req.body;
  var id       = data._id             || "anonymous";
  var nickname = data.nickname        || "anonymous";
  var score    = parseInt(data.score) || 0;
  var limit    = data.limit           || 10;
  db_uvcatcher.update({userid: id, lan: req.params.lan}, 
      {$set:{dt: new Date().getTime(), score: score, nickname: nickname}},
      {upsert: true}, function(err, doc) {
    if (err || !doc) {
      return callback("");                                                      // RETURN: 返回更新错误
    }
    db_uvcatcher.find({lan: req.params.lan}).sort({score: -1, dt: 1}).limit(limit, function(err, docs) {
      if (err) {
        return callback("");                                                    // RETURN: 返回错误
      }
      var rank_list = [];
      for (var i=0; i<docs.length; i++) {
        rank_list.push(docs[i].score.toString());
      }
      return callback(plist.build({"Ranking List": rank_list}).toString());     // RETURN: 返回更新成功
    });
  });
};
// 紫外线收割机排行榜
exports.uvrank = function(req, callback) {
  console.log("hear this");
  db_uvcatcher.find({lan: req.params.lan}).sort({score: -1}).limit(8,function(err, docs){
    if (err || docs.length === 0) {
  console.log("hear this 2");
      return callback({ret: 2});                               // RETURN: 返回获取错误
    }
  console.log("hear this 3");
    return callback({ret: 1, rank: docs});                     // RETURN: 返回获取成功
  });
};
// 寻找黄眼镜
exports.findglass = function(req, callback) {
  var data     = req.body;
  var id       = data._id      || "anonymous";
  var nickname = data.nickname || "anonymous";
  var limit    = data.limit    || 10;
  var score    = parseFloat(data.score) || 100000;
  db_findglass.update({userid: id, lan: req.params.lan},
      {$set: {nickname: nickname, score: score, dt: new Date().getTime()}},
      {upsert: true}, function(err, doc){
    if (err || !doc) {
      return callback("");                                                       // RETURN: 返回更新错误
    }
    db_findglass.find({lan: req.params.lan}).sort({score: 1, dt: 1}).limit(limit, function(err, docs) {
      if (err || docs.length === 0) {
        return callback("");                                                     // RETURN: 返回错误
      }
      var rank_list = [];
      for (var i=0; i<docs.length; i++) {
        rank_list.push(docs[i].score.toString());
      }
      return callback(plist.build({"Ranking List": rank_list}).toString());      // RETURN: 返回更新成功
    });
  });
};
// 寻找黄眼镜获取图片数据
exports.findglasspulldata = function(req, callback) {
  db_findglasspic.find({dt: {$gt: parseInt(req.params.timestamp)}, lan: req.params.lan}).sort({_id: -1},function(err, docs){
    if (err || docs.length===0) {
      return callback({ret: 2});                               // RETURN: 返回更新错误
    }
    return callback({ret: 1, pics: docs});                     // RETURN: 返回更新成功
  });
};
// 获取寻找晃眼睛排行榜
exports.fgrank = function(req, callback) {
  db_findglass.find({lan: req.params.lan}).sort({score: 1}).limit(8,function(err, docs){
    if (err || docs.length === 0) {
      return callback({ret: 2});                               // RETURN: 返回获取错误
    }
    return callback({ret: 1, rank: docs});                     // RETURN: 返回获取成功
  });
};
// ###优惠券
// 用户收藏优惠券
exports.storecoupon = function(req, callback) {
  var prodid = req.body.prodid||"ffffffffffff";
  var userid = req.body.userid||"ffffffffffff";
  db_product.findOne({_id: new ObjectID(prodid)}, function(err, doc){
    if (err || !doc) {
      return callback({ret: 4});                                  // RETURN: 产品不存在
    }
    if (!doc["sc-remain"] || doc["sc-remain"] <= 0) {
      if (!doc["nc-remain"] || doc["nc-remain"] <= 0) {
        return callback({ret: 5});                                // RETURN: 优惠券没了
      }
    }
    db_usercoupon.findOne({prodid: prodid, userid: userid}, function(err, saved){
      if (err) {
        return callback({ret: 2});                                // RETURN: 返回数据查询错误
      }
      if (saved) {
        return callback({ret: 3});                                // RETURN: 已经存在
      }
      var elem = {
        prodid :  prodid, 
        userid :  userid,
        content:  doc["sc-content"] || doc["nc-content"],
        detail :  doc["sc-detail"] || doc["nc-detail"],
        start  :  new Date(new Date(doc["sc-start"] || doc["nc-start"]).getTime()+8*3600*1000),
        end    :  new Date(new Date(doc["sc-end"] || doc["nc-end"]).getTime()+8*3600*1000),
        dt     :  new Date().getTime(),
        lan    :  doc.lan
      };
      elem.key = "CP" + parseInt(elem.dt%100000000000);// 取CP+时间戳的毫秒级后11位组成唯一码
      db_usercoupon.insert(elem, function(err, saved){
        if (err) {
          return callback({ret: 2});                              // RETURN: 错误
        }
        db_product.update({_id: new ObjectID(prodid)}, {$inc: {"sc-remain": -1}}, function(err, doc) {
        });
        return callback({ret: 1});                                // RETURN: 存储成功
      });
    });
  });
};

// 获得优惠券
exports.getcoupon = function(req, callback) { 
  var data     = req.body;
  var userid   = data._id;
  var isworker = data.isworker;
  if (isNaN(isworker)) {
    isworker = 0;
  }
  var type = 1;       // 普通优惠券
  if (isworker > 0)
    type = 2;         // 员工优惠券
  var gotcoupon = false;
  db_coupon.find({lan: req.params.lan, type: type}, function(err, docs) { 
    if (err) {
      return callback({ret: 2});                                // RETURN: 没有产生优惠券
    }
    var random = Math.random();
    var sumpos = 0;
    var index  = 0;
    for (; index<docs.length; index++) {
      var doc = docs[index];
      if (new Date(doc.end).getTime() < new Date().getTime())
        continue;
      if (random<=sumpos+doc.possibility) {
        gotcoupon = true;
        break;
      }
      sumpos += doc.possibility;
    }
    if (gotcoupon === false)
      return callback({ret: 2});                                // RETURN: 没有产生优惠券
    if (index>=docs.length) {
      index = docs.length-1;
    }
    var elem = {
      prodid :  "null", 
      userid :  userid,
      content:  docs[index].content,
      detail :  docs[index].detail,
      start  :  docs[index].expiress,
      end    :  docs[index].expirese,
      dt     :  new Date().getTime()
    };
    elem.key = "CP" + parseInt(elem.dt%100000000000);    // 取CP+时间戳的毫秒级后11位组成唯一码
    db_usercoupon.insert(elem, function(err, doc){
      if (err) {
        return callback({ret: 2});                               // RETURN: 没有产生优惠券
      }
      doc.start = new Date(doc.start).format('yyyy-MM-dd');
      doc.end   = new Date(doc.end).format('yyyy-MM-dd');
      return callback({ret: 1, val: doc});                       // RETURN: 返回获取到的优惠券
    });
  });
};

// 验证优惠券
exports.checkcoupon = function(req, callback) { 
  var data      = req.body;
  var key = data.key || "null";
  db_usercoupon.findOne({key: key, isdeleted: null}, function(err, doc) { 
    if (err || !doc) {
      return callback({ret: 2});                                // RETURN: 优惠券不存在
    }
    return callback({ret: 1});                                  // RETURN: 优惠券存在
  });
};

// 使用优惠券
exports.usecoupon = function(req, callback) { 
  var data = req.body;
  var key  = data.key  || "not a couponkey";
  var code = data.code || "null";
  db_usercoupon.findOne({key: key}, function(err, doc) { 
    if (err || !doc) {
      return callback({ret: 4});                              // RETURN: 这张优惠券不存在
  } else if (new Date(doc.end).getTime() < new Date().getTime()) {
    return callback({ret: 5});                                // RETURN: 这类优惠券已过期
  } else if (doc.isdeleted) {
      return callback({ret: 3});                              // RETURN: 这张优惠券已使用
    }
    db_usercoupon.update({key: key}, {$set: {isdeleted: true}}, function(err, data){
      if (err) {
        return callback({ret: 2});                            // RETURN: 优惠券使用失败
      }
      // 存储品牌识别码
      var lan = doc.lan;
      db_brandcode.findOne({code: code, lan: lan}, function(err, doc) {
        if (err) {
          return ;
        }
        if (!doc) {
          var doc = {};
          doc.code = code;
          doc.num  = 1;
        } else {
          doc.num  = doc.num + 1;
        }
        db_brandcode.update({code: code, lan: lan}, doc, {upsert: 1}, function(err, updated) {
        });
      });
      return callback({ret: 1});                              // RETURN: 这张优惠券使用成功
    });
  });
};

// 优惠券列表(用户)
exports.couponlist = function(req, callback) { 
  // var data   = req.body;
  // var userid = data.userid;
  var userid = req.params.userid;
  var page   = parseInt(req.params.page);
  if (isNaN(page)) {
    page = 1;
  }
  var limit  = parseInt(req.params.limit);
  if (isNaN(limit)) {
    limit = 3;
  }
  db_usercoupon.find({userid: userid, isdeleted: {$not: {$in: [true]}}}).sort({dt: -1}).skip((page-1)*limit).limit(limit, function(err, docs) { 
    if (err) {
      return callback({ret: 2});                                // RETURN: 查询错误
    }
    for (var i=0; i< docs.length; i++) {
      docs[i].start = new Date(docs[i].start).format('yyyy-MM-dd');
      docs[i].end   = new Date(docs[i].end).format('yyyy-MM-dd');
    }
    return callback({ret: 1, val: docs});                       // RETURN: 优惠券列表
  });
};

// ###门店品牌接口
//获取省，市，区县接口
exports.getprovince = function(req,callback){
  db_regional.find({},function(err, docs){
    if (err) {
      callback({ret: 2});                           // RETURN: 数据库出错
    }
    var province = new Array();
    for(var i=0;i<docs.length;i++){
      if(province.indexOf(docs[i].city)===-1){
        province.push(docs[i].city);
      }     
    }                                   
    callback({ret: 1, val: province});              // RETURN: 返回成功
  });
};
exports.getcity = function(req,callback){
  var body = req.body;
  db_regional.find({city: body.province}, function(err, docs){
    if (err) {
      callback({ret: 2});                           // RETURN: 数据库出错
    }
    var city = new Array();
    for(var i=0;i<docs.length;i++){
      if(city.indexOf(docs[i].county)===-1){
        city.push(docs[i].county);
      }
    }
    callback({ret: 1, val: city});
  });
};
exports.getarea = function(req,callback){
  var body = req.body;
  var query = {};
  query.city = body.province;
  query.county = body.city;
  db_regional.find(query, function(err, docs){
    if (err) {
      callback({ret: 2});                           // RETURN: 数据库出错
    }
    var area = new Array();
    for(var i=0;i<docs.length;i++){
      area.push(docs[i].prov);
    }
    callback({ret: 1, val: area});
  });
};

// 根据省市区获取门店列表，可翻页
exports.store = function (req, callback) {
  var data = req.body;
  var numPerPage = parseInt(data.numPerPage);
  var pageNum = parseInt(data.pageNum);
  var query = {};
  query.province = data.province;
  query.municipality = data.municipality;
  query.area = data.area;
  query.lan = req.params.lan;
  db_store.find(query).limit(numPerPage).skip(numPerPage*(pageNum-1), function(err, docs){
    if (err){
      return callback({ret: 2});                                //RETURN: 查询出错
    }
    for (index in docs) {
      docs[index]._id = docs[index]._id.toString();
      delete docs[index].province;
      delete docs[index].municipality;
      delete docs[index].area;
      delete docs[index].lan;
    }
    return callback({ret: 1, num:docs.length, list: docs});      // RETURN: 返回成功
  });
};
//获取品牌列表
exports.brand = function (req, callback){
  db_brand.find({lan:req.params.lan},function(err,docs){
    if (err) {
      return callback({ret: 2});                                // RETURN: 查询错误
    }
    var brand = new Array();
    var temp = new Array();
    for(var i=0; i<docs.length; ){      
      temp = [];
      for (var j=0; j<6&&i<docs.length; j++,i++) {
      	temp.push({url: "/img/brand/"+docs[i]._id.toString()+".jpg",
      			   brand: docs[i].name});
      }
      brand.push(temp);
    }
    return callback({ret: 1, logolist: brand});
  });

}

//根据品牌获取产品列表
exports.products = function(req,callback){
  var data = req.body;
  var numPerPage = parseInt(data.numPerPage);
  var pageNum = parseInt(data.pageNum);
  var query = {
  	brand : data.brand
  };
  if(data['E-SPF']==='10'){
  	query['E-SPF'] = '10';
  }else if(data['E-SPF']==='15'){
  	query['E-SPF'] = '15';
  }else if(data['E-SPF']==='25'){
  	query['E-SPF'] = '25';
  }
  query.lan = req.params.lan;
  db_product.find(query).sort({dt: -1}).skip(numPerPage*(pageNum-1)).limit(numPerPage, function(err, docs){
    if (err) {
      return callback({ret: 2});           // RETURN: 查询错误
    }
    var prods = [];
    for(var doc=0; doc<docs.length; doc++){
      var prod = {};
      prod.name = docs[doc].name;
      prod._id  = docs[doc]._id;
    	if(docs[doc].sale==='yes'){
    		prod.sale = true;
    	}else{
    		prod.sale = false;
    	}
    	prod.url = "/img/product/" + docs[doc]._id.toString() + ".jpg";
      prods.push(prod);
	  }
    return callback({ret: 1, val: prods});
  });
};

//获取产品详情
exports.productdetail = function(req,callback){
  var query = {};
  query._id = new ObjectID(req.params.id);
  db_product.findOne(query,function(err, doc){
    if (err) {
      return callback({ret: 2});           // RETURN: 查询错误
    }
    var pic = new Array();
    var con = new Array();
    
    var image = doc.image;
    for(var i=0; i<image.length;i++){
    	var ima = {};
    	ima.des = image[i].des;
    	ima.url = "/img/product/" + image[i].url + doc._id.toString() + ".jpg";
    	pic.push(ima);
    }
    if (doc.nc_enable) {
      doc.nomalcoupon = {
        content : doc["nc-content"],
        detail  : doc["nc-detail"],
        start   : doc["nc-start"],
        end     : doc["nc-end"],
        remain  : doc["nc-remain"]
      };
    }
    if (doc.sc_enable) {
      doc.specialoupon = {
        content : doc["sc-content"],
        detail  : doc["sc-detail"],
        start   : doc["sc-start"],
        end     : doc["sc-end"],
        remain  : doc["sc-remain"]
      };
    }
    delete doc["nc-content"];
    delete doc["nc-detail"];
    delete doc["nc-start"];
    delete doc["nc-end"];
    delete doc["nc-remain"];
    delete doc["sc-content"];
    delete doc["sc-detail"];
    delete doc["sc-start"];
    delete doc["sc-end"];
    delete doc["sc-remain"];
    con = doc.contents;
    delete doc.contents;
    delete doc.image;
    delete doc.stores;
    delete doc.discount;
    return callback({
    				ret: 1, 
            products: doc,
            image : pic,
            contents: con
    				});
  });
};

// 根据经纬度获得两点间的距离
function getDistance(lngA, latA, lngB, latB) {
  var lat1 = Math.PI/180*latA;
  var lat2 = Math.PI/180*latB;
  var lon1 = Math.PI/180*lngA;
  var lon2 = Math.PI/180*lngB;
  var Pi  = Math.PI;
  var R   = 6371.004;//地球半径
  var sin = Math.sin;
  var cos = Math.cos;
  var Distance =  Math.acos(Math.sin(lat1)*Math.sin(lat2)+Math.cos(lat1)*Math.cos(lat2)*Math.cos(lon2-lon1))*R;
  return Distance;
}

// 根据商品id获取店铺（分页）
exports.prodstores = function(req, callback) {
  var near_store   = true;
  var query   = req.params;
  query.skip  = parseInt(query.skip);
  query.limit = parseInt(query.limit);
  query.lng   = parseFloat(query.lng);
  query.lat   = parseFloat(query.lat);
  if (query.lng===0&&query.lat===0&&query.prov==="null"&&query.muni==="null"&&query.area==="null") {
    query.prov = "北京";
    query.muni = "北京";
    near_store = false;
  }
  if (query.prov.indexOf("省")!==-1 || query.prov.indexOf("市")!==-1) {
    query.prov = query.prov.slice(0, query.prov.length-1);
  }
  if (query.muni.indexOf("市")!==-1) {
    query.muni = query.muni.slice(0, query.muni.length-1);
  }
  if (query.area.indexOf("区")!==-1 || query.area.indexOf("县")!==-1) {
    query.area = query.area.slice(0, query.area.length-1);
  }
  if (query.prov !== "null") {
    eval("query.prov = /"+query.prov+"/");
  } else {
    query.prov = /./;
  }
  if (query.muni !== "null") {
    eval("query.muni = /"+query.muni+"/");
  } else {
    query.muni = /./;
  }
  if (query.area !== "null") {
    eval("query.area = /"+query.area+"/");
  } else {
    query.area = /./;
  }
  if (query.cont !== "null") {
    eval("query.cont = /"+query.cont+"/");
  } else {
    query.cont = /./;
  }
  db_product.findOne({_id: new ObjectID(query.prodid)}, function(err, doc){
    if (err || !doc) {
      callback({ret: 2});
    }
    if (!doc.stores || doc.stores.length === 0) {
      callback({ret: 1, val: {stores: [], near: false}});
    }
    var storeIds = [];
    if (!doc.stores) {
      doc.stores = [];
    }
    for (var i=0; i<doc.stores.length; i++) {
      storeIds.push(new ObjectID(doc.stores[i]));
    }
    db_store.find({_id: {"$in": storeIds}, gps: {"$near": [query.lng, query.lat]}, province: query.prov, municipality: query.muni, area: query.area, $or:[{address: query.cont}, {name: query.cont}]}).skip((query.skip-1)*query.limit).limit(query.limit, function(err, docs){
      if (err) {
        return callback({ret: 2});
      }
      var discountMap = {};
      for (var i=0; i<doc.stores.length; i++) {
        discountMap[doc.stores[i]] = doc.discount[i];
      }
      for (var i=0; i<docs.length; i++) {
        docs[i].discount  = discountMap[docs[i]._id.toString()];
        docs[i].distance  = getDistance(query.lng, query.lat, docs[i].gps[0], docs[i].gps[1]);
      }
      if (docs.length === 0) {
        near_store = false;
      }
      return callback({ret: 1, val: {stores: docs, near: near_store}});
    });
  });
};

//#############产生随机数#############
//获取随机数
exports.random = function(callback){
  db_random.findOne({}, function(err, doc) {
    if (err) {
      return callback({ret: 2});                 // 错误
    }
    return callback({ret: 1, num: doc.random});
  });
};

// 获取tips
exports.gettips = function(req, callback){
  var query = {
    lan : req.params.lan,
    espf: req.body.espf,
    weather : req.body.weather
  }
  db_tips.find(query, function(err,docs){
    if (err) {
      callback({ret: 2});                           // RETURN: 数据库出错
    }
    var tips = new Array();
    for(var i=0;i<docs.length;i++){
      tips.push(docs[i].detail);
    }
    callback({ret: 1, val: tips});                  // RETURN: 返回成功
  });
};

// 统计分享次数
exports.sharelink = function(req, callback) {
  var userid = req.params.userid;
  var lan    = req.params.lan;
  db_user.update({_id: new ObjectID(userid)}, {$inc: {sharenum: 1}}, function(err){
    return callback({ret: 1});                                       // 操作完成
  });
};

// 获取版本信息
exports.appversion = function(req, callback) {
  var lan    = req.params.lan;
  db_appversion.findOne({lan: lan}, function(err, doc){
    if (err || !doc) {
      return callback({ret: 2});                   // RETURN: 版本信息获取失败
    }
    doc.time   = new Date(doc.time).getTime();
    doc.number = parseInt(doc.number);
    return callback({ret: 1, val: doc});           // RETURN: 版本信息获取成功
  });
};

// 获取苹果版本信息
exports.appleversion = function(req, callback) {
  var lan    = req.params.lan;
  db_appleversion.findOne({lan: lan}, function(err, doc){
    if (err || !doc) {
      return callback({ret: 2});                   // RETURN: 版本信息获取失败
    }
    doc.time   = new Date(doc.time).getTime();
    doc.number = doc.number;
    return callback({ret: 1, val: doc});           // RETURN: 版本信息获取成功
  });
};

// 获取Android去评分
exports.androidscore = function(req, callback) {
  var lan    = req.params.lan;
  db_androidscore.findOne({lan: lan}, function(err, doc){
    if (err || !doc) {
      return callback({ret: 2});                   // RETURN: Android去评分获取失败
    }
    return callback({ret: 1, val: doc});           // RETURN: Android去评分获取成功
  });
};

// 注册DEVICEID
exports.reg_deviceid = function(req, callback) {
  var lan    = req.params.lan;
  var body   = req.body;
  db_deviceid.findOne({ deviceid: body.deviceid }, function(err, doc){
    if (err || !doc) {
      db_deviceid.insert({deviceid: body.deviceid, lan: req.params.lan, os: body.os, userid: ""}, function(err, doc){
        if (err) {
          return callback({ret: 2});               // RETURN: DEVICEID注册失败
        } else {
          return callback({ret: 1, val: doc});     // RETURN: DEVICEID注册成功
        }
      });
    } else {
      return callback({ret: 1, val: doc});         // RETURN: DEVICEID注册成功
    }
  });
};
