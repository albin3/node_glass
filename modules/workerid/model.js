// workerid model.js
var config = require('../../config');
var mongojs = require('mongojs');

var db = mongojs(config.dbinfo.dbname);
var dbobj = db.collection('workerid');
var ObjectID = require('mongodb').ObjectID;
var password_hash = require('password-hash');

// 找到所有数据
exports.allobjs =  function (req, callback) {
  dbobj.find({ lan: req.params.lan },function (err, docs) {
    if (err) {
      callback(err);
    } else {
      callback(null, docs);
    }
  });
};

// 删除某个后台用户
exports.objdel =  function (id, callback) {
  dbobj.remove(
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

// 改变项目状态
exports.changestate = function (id, state, callback) {
  if (state.disable === "true") {
    state.disable = true;
  } else {
    state.disable = false;
  }
  dbobj.update({
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

// 删除所有项目
exports.delall = function (req, callback) {
  dbobj.remove({ lan: req.params.lan },function (err){
    if (err) {
      return callback({status: false});
    } else {
      return callback({status: true});
    }
  });
};

// 增加一个项目
exports.objadd = function (req, callback) {
  var obj = req.body;
  obj.lan = req.params.lan;
  dbobj.insert(obj, function (err, doc) {
    if (err){
      return callback({ret: 2});              // RETURN: 唯一项重复
    }
    return callback({ret: 1, obj: doc});      // RETURN: 增加成功
  });
};
