// userctrl model
var config = require('../../config');
var mongojs = require('mongojs');
var xlsx = require('node-xlsx');
var fs = require('fs');

var db = mongojs(config.dbinfo.dbname);
var dbappuser = db.collection('appuser');
var ObjectID = require('mongodb').ObjectID;

// 找到所有app用户数据
exports.alluser =  function (callback) {
  dbappuser.find(function (err, docs) {
    if (err) {
      callback(err);
    } else {
      callback(null, docs);
    }
  });
};

// 删除某个app用户
exports.userdel =  function (id, callback) {
  dbappuser.remove(
      {
        _id: new ObjectID(id)
      },function (err) {
        if (err) {
          callback(err);
        } else {
          callback(null);
        }
      });
};

// 查找某个用户
exports.finduser =  function (id, callback) {
  dbappuser.findOne(
      {
        _id: new ObjectID(id)
      },function (err, doc) {
        if (err) {
          callback(err);
        } else {
          callback(null, doc);
        }
      });
};

// 更新某个用户
exports.updateuser =  function (req, callback) {
  var query = {
    _id : new ObjectID(req.params.userid)
  };
  dbappuser.findOne(query, function (err, doc) {
    if (err) {
      return callback(err);              // RETURN: 查询错误
    }
    doc.nickname = req.body.nickname;
    doc.tel = req.body.tel;
    doc.email = req.body.email;
    
    dbappuser.update(query,
        doc, function (err, doc) {
        if (err) {
          return callback(err);          // RETURN: 更新时出错
        } else {
          return callback(null, doc);    // RETURN: 更新成功
        }
      });
  });
};

// 将用户停封或解除停封
exports.changestate = function (id, state, callback) {
  if (state.disable === "true") {
    state.disable = true;
  } else {
    state.disable = false;
  }
  dbappuser.update({
    _id : new ObjectID(id)
  }, {
    $set: state
  }, function(err, doc){
    if (err) {
      callback(err);                // RETURN: 改变状态出错
    }
    callback(null);                 // RETURN: 改变状态成功
  });
};

// 导出到到Excel
exports.exportexcel = function (callback) {
  dbappuser.find({}, function(err, docs){
    if (err) {
      return callback({ret: 2});                            // RETURN: 查询出错
    }
    var th = new Array();
    var data = new Array();
    th = ["编号", "昵称", "电话", "邮箱", "第三方登录", "性别", "是否封停", "是否为员工(0表示非员工)"];
    data.push(th);
    for (var index=0; index<docs.length; index++){
      var td = new Array();
      td.push({value: docs[index]._id.toString(), formatCode: "General"});
      td.push({value: docs[index].nickname      , formatCode: "General"});
      td.push({value: docs[index].tel           , formatCode: "General"});
      td.push({value: docs[index].email         , formatCode: "General"});
      td.push({value: docs[index].thirdpath     , formatCode: "General"});
      td.push({value: docs[index].sex           , formatCode: "General"});
      td.push({value: docs[index].disable       , formatCode: "General"});
      td.push({value: docs[index].isworker      , formatCode: "General"});
      data.push(td);
    }
    var buffer = xlsx.build({worksheets: [
      {name: "userData", data: data}
      ]});
    var appUserPath = config.appPath() + "/static/appuser/appuser.xlsx";
    fs.writeFileSync(appUserPath, buffer);
    return callback({ret: 1, appUserPath: appUserPath});                            // RETURN: 处理成功
  });
};

// 获取用户页数
exports.totalPages = function(numPerPage, callback) {
  dbappuser.count(function(err, numTotal) {
    if (err) {
      return callback(1);
    }
    return callback(Math.ceil(numTotal/numPerPage));
  });
};

// 获取用户（分页）
exports.getUsers = function(query, callback) {
  dbappuser.find({ }).sort({nickname : 1}).sort({isworker: -1, sharenum: -1, clicknum: -1, nickname: 1}).skip((query.skip-1)*query.limit).limit(query.limit, function(err, docs){
    if (err) 
      return callback({ret: 2, val: []});
    else 
      return callback({ret: 1, val: docs});
  });
};
