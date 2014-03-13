// userctrl model
var config = require('../../config');
var mongojs = require('mongojs');

var db = mongojs(config.dbinfo.dbname);
var dbbguser = db.collection('bguser');
var ObjectID = require('mongodb').ObjectID;

// 找到所有后台用户数据
exports.alluser =  function (callback) {
  dbbguser.find(function (err, docs) {
    if (err) {
      callback(err);
    } else {
      callback(null, docs);
    }
  });
};

// 删除某个后台用户
exports.userdel =  function (id, callback) {
  dbbguser.remove(
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
  dbbguser.findOne(
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
  dbbguser.findOne(query, function (err, doc) {
    if (err) {
      return callback(err);       // RETURN: 查询错误
    }
    doc.nickname = req.body.nickname;
    doc.tel = req.body.tel;
    doc.email = req.body.email;
    
    dbbguser.update(query,
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
  dbbguser.update({
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

// 删除所有用户
exports.delall = function (callback) {
  // TODO: 待实现
  callback({ret: 1});
};
