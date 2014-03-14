// appapi model.js
var config = require('../../config');
var mongojs = require('mongojs');
var password_hash = require('password-hash');
var db = mongojs(config.dbinfo.dbname);

var db_user = db.collection('appuser');
var db_news = db.collection('news');
var db_workerid = db.collection('workerid');
var ObjectID = require('mongodb').ObjectID;

/**
 * 新用户注册
 */
exports.newuser = function (user, callback) {
  console.log(user);
  
  // 验证员工号码
  user.isworker = 0;
  if (user.workid !== undefined && user.workid !== ""){
    db_workerid.findOne({workerid: user.workid}, function (err, doc) {
      if (err) {
        return callback({ret: 3});   // RETURN: 员工Id验证错误
      }
      user.isworker = 1;
    });
  }

  // 插入数据库
  user.password = password_hash.generate(user.password);
  user.disable = false;
  db_user.insert(user, function (err, doc) {
    if (err) {
      console.log(err.message);
      return callback({ret: 2});    // RETURN: 注册字段重复
    }
    return callback({               // RETURN: 注册成功
           ret      : 1,
           userid   : doc._id.toString(),
           isworker : doc.isworker
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
    if (err || !doc) {
      return callback({ret: 4});         // RETURN: 账号不存在
    }
    if (doc.disable) {
      return callback({ret: 3});         // RETURN: 账号被停封
    }
    if (!password_hash.verify(user.password, doc.password)){
      return callback({ret: 2});         // RETURN: 账号密码不正确
    }
    return callback({                    // RETURN: 账号密码正确
           ret      : 1,
           userid   : doc._id.toString(),
           isworker : doc.isworker
    });
  });
};

/**
 * 修改用户密码
 */
exports.chpassword = function (user, callback) {
  var query = {_id: new ObjectID(user.userid)};

  db_user.findOne(query, function(err, doc){
    if (err || !doc) {
      return callback({ret: 4});         // RETURN: 账号不存在
    }
    if (doc.disable) {
      return callback({ret: 3});         // RETURN: 账号被停封
    }
    if (!password_hash.verify(user.oldpsd, doc.password)){
      return callback({ret: 2});         // RETURN: 账号密码不正确
    }

    doc.password = password_hash.generate(user.newpsd);
    db_user.update(query, doc, function(err, updated){
      if(err) {
        return callback({ret: 5});       // RETURN: 数据库错误
      }
      return callback({                  // RETURN: 账号密码正确
             ret      : 1,
             userid   : doc._id.toString(),
             isworker : doc.isworker
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
        return callback({ret: 5});       // RETURN: 数据库错误
      }
      return callback({                  // RETURN: 账号密码正确
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
    
    mid.tel = user.tel || mid.tel;
    mid.email = user.email || mid.email;
    mid.sex = user.sex || mid.sex;
    db_user.update(query, mid, function(err, doc){
      if (err) {
        return callback({ret: 2});       // RETURN: 邮箱或手机号已经被使用
      }
      return callback({                  // RETURN: 修改成功
             ret      : 1,
             userid   : mid._id.toString(),
             isworker : mid.isworker
      });
    });
  });
};


// ###新闻接口
// 新闻列表
exports.allnews = function (callback) {
  db_news.find({}, function(err, docs){
    if (err){
      return callback({ret: 2});
    }
    return callback({ret: 1, newslist: docs});
  });
};
