// Copyright © 2014 Albin. All Rights Reserved.
// 配置系统环境，在mongodb中写入初始化信息
// 包括设置用户名唯一索引等...
//     将中国地省市区导入到mongodb...

var config = require('../config');
    MongoClient = require('mongodb'),
    mongojs = require('mongojs'),
    db = mongojs(config.dbinfo.dbname),
    dbregional = db.collection('regional'),
    xlsx = require('node-xlsx'),
    password_hash = require('password-hash');

// 建立后台用户的唯一索引
MongoClient.connect(config.dbinfo.dbpath, function (err, db) {
      
      // 清空数据库
        var dbaccount = db.collection('account');

        // 建索引
        dbaccount.ensureIndex({ username: 1 },
          { unique: true, dropDups: true },
          function (err) {
            if (err) { 
              console.log(err.message); 
            } else { 
              console.log("create unique index success"); 
            }

            var root_user = config.root_user;
            root_user.password = password_hash.generate(root_user.password);
            root_user.disable = false;
            dbaccount.insert(config.root_user, function(err, doc){
              console.log("root account inserted.");
            });
            db.close();
          }
          );
});

// appuser 唯一tel索引
MongoClient.connect("mongodb://" + config.dbinfo.dbhost + ":" + config.dbinfo.dbport 
    + "/" + config.dbinfo.dbname + "?w=1", function (err, db) {
      var dbaccount = db.collection('appuser');

      // 建索引
      dbaccount.ensureIndex({ tel: 1 },
        { unique: true, dropDups: true, sparse: true },
        function (err) {
          if (err) { 
            console.log(err.message); 
          } else { 
            console.log("appuser create unique tel as index success"); 
          }
          db.close();
      });
});

// appuser 唯一email索引
MongoClient.connect("mongodb://" + config.dbinfo.dbhost + ":" + config.dbinfo.dbport 
    + "/" + config.dbinfo.dbname + "?w=1", function (err, db) {
      var dbaccount = db.collection('appuser');

      // 建索引
      dbaccount.ensureIndex({ email: 1 },
        { unique: true, dropDups: true, sparse: true },
        function (err) {
          if (err) { 
            console.log(err.message); 
          } else { 
            console.log("appuser create email as unique index success"); 
          }
          db.close();
      });
});

// appuser 唯一thirdpathname索引
MongoClient.connect("mongodb://" + config.dbinfo.dbhost + ":" + config.dbinfo.dbport 
    + "/" + config.dbinfo.dbname + "?w=1", function (err, db) {
      var dbaccount = db.collection('appuser');

      // 建索引
      dbaccount.ensureIndex({ thirdpathname: 1 },
        { unique: true, dropDups: true, sparse: true },
        function (err) {
          if (err) { 
            console.log(err.message); 
          } else { 
            console.log("appuser create thirdpathname as unique index success"); 
          }
          db.close();
      });
});

// appversion 初始化
MongoClient.connect("mongodb://" + config.dbinfo.dbhost + ":" + config.dbinfo.dbport 
    + "/" + config.dbinfo.dbname + "?w=1", function (err, db) {
      var dbaccount = db.collection('appversion');

      dbaccount.insert({ index: "0.0.0" },
        function (err) {
          if (err) { 
            console.log(err.message); 
          } else { 
            console.log("appversion collection init successed."); 
          }
          db.close();
      });
});

// workerid 唯一index索引
MongoClient.connect("mongodb://" + config.dbinfo.dbhost + ":" + config.dbinfo.dbport 
    + "/" + config.dbinfo.dbname + "?w=1", function (err, db) {
      var dbaccount = db.collection('workerid');

      // 建索引
      dbaccount.ensureIndex({ index: 1 },
        { unique: true, dropDups: true, sparse: true },
        function (err) {
          if (err) { 
            console.log(err.message); 
          } else { 
            console.log("workerid create workerid as unique index success"); 
          }
          db.close();
      });
});

// coupon 唯一index索引
MongoClient.connect("mongodb://" + config.dbinfo.dbhost + ":" + config.dbinfo.dbport 
    + "/" + config.dbinfo.dbname + "?w=1", function (err, db) {
      var dbaccount = db.collection('coupon');

      // 建索引
      dbaccount.ensureIndex({ index: 1 },
        { unique: true, dropDups: true, sparse: true },
        function (err) {
          if (err) { 
            console.log(err.message); 
          } else { 
            console.log("coupon create workerid as unique index success"); 
          }
          db.close();
      });
});

// regional 唯一index索引
MongoClient.connect("mongodb://" + config.dbinfo.dbhost + ":" + config.dbinfo.dbport 
    + "/" + config.dbinfo.dbname + "?w=1", function (err, db) {
      var dbaccount = db.collection('regional');

      // 建索引
      dbaccount.ensureIndex({ index: 1 },
        { unique: true, dropDups: true, sparse: true },
        function (err) {
          if (err) { 
            console.log(err.message); 
          } else { 
            console.log("regional create workerid as unique index success"); 
          }
          db.close();
      });
});
// 建立店铺的地理索引
MongoClient.connect(config.dbinfo.dbpath, function (err, db) {
    var dbaccount = db.collection('stores');
    // 建地理索引
    dbaccount.ensureIndex({ gps: "2d" },
      {},
      function (err) {
      if (err) { 
      console.log(err.message); 
      } else { 
      console.log("create 2d index success"); 
      }
      db.close();
      }
      );
});
// 将中国地省市县数据导入到mongodb中
var load_regional = function() {
  var objs = xlsx.parse(__dirname+"/regional.xlsx").worksheets[0].data;
  for (var i=0; i<objs.length; i++) {
    var obj = objs[i];
    if (typeof obj[4].value !== "number" || obj[4].value !== 2) {
      continue;
    }
    var data = {};
    data.index = obj[0].value;
    data.prov  = obj[1].value;
    data.city  = obj[2].value;
    data.county= obj[3].value;
    dbregional.insert(data, function(err, doc) {
    });
  }
};
load_regional();
