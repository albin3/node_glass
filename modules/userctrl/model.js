// userctrl model
var config = require('../../config');
var mongojs = require('mongojs');

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
          console.log(doc);
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
      return callback(err);       // RETURN: 查询错误
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
      callback(err);
    }
    callback(null);
  });
};
