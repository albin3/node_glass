// model.js store
var config = require('../../config');
var mongojs = require('mongojs');

var db = mongojs(config.dbinfo.dbname);
var dbstore = db.collection('store');
var dbregional = db.collection('regional');
var ObjectID = require('mongodb').ObjectID;

// 新建store
exports.newstore = function (req, callback) {
  var store = req.body;
  store.lan = req.params.lan;
  var id = store._id;
  if(id!==''){
    store._id = new ObjectID(id);
    dbstore.update({_id : store._id}, store, function(err, doc){
      if(err){
        return callback({ret: 2});
      }
      return callback({ret: 1, val: doc}); 
    });
  }else{
    delete store._id;
    dbstore.insert(store, function(err, doc){
      if (err) {
        return callback({ret: 2});                    // RETURN: 数据库插入出错
      }
      doc._id = doc._id.toString();
      return callback({ret: 1, val: doc});            // RETURN: 插入成功
    });
  }
};

// 查询所有store
exports.allstore = function (req, callback) {
  dbstore.find({lan : req.params.lan}, function(err,docs){
    if (err) {
      callback({ret: 2});                           // RETURN: 数据库出错
    }
    callback({ret: 1, val: docs});                  // RETURN: 返回成功
  });
};

// 查询指定store
exports.toedit = function (req, callback) {
  dbstore.findOne({_id : new ObjectID(req.params.id)}, function(err,docs){
    if (err) {
      callback({ret: 2});                           // RETURN: 数据库出错
    }
    callback({ret: 1, val: docs});                  // RETURN: 返回成功
  });
};

// 删除指定store
exports.delstore = function (store, callback) {
  dbstore.remove({_id: new ObjectID(store._id)}, function(err){
    if (err) {
      callback({ret: 2});                           // RETURN: 数据库出错
    }
    callback({ret: 1});                             // RETURN: 返回成功
  });
};

// 删除所有
exports.delall = function (req, callback) {
  dbstore.remove({lan : req.params.lan}, function(err){
    if (err) {
      callback({ret: 2});                           // RETURN: 数据库出错
    }
    callback({ret: 1});                             // RETURN: 返回成功
  });
};

// 获取城市
exports.getcity = function (body, callback) {
  console.log(body);
  dbregional.find({city: body.province}, function(err, docs){
    if (err) {
      callback({ret: 2});                           // RETURN: 数据库出错
    }
    var city = new Array();
    for(var i=0;i<docs.length;i++){
      if(city.indexOf(docs[i].county)===-1){
        city.push(docs[i].county);
      }
    }
    console.log(city);
    callback({ret: 1, val: city});
  });
};

// 获取区县
exports.getarea = function (body, callback) {
  console.log(body);
  var query = {};
  query.city = body.province;
  query.county = body.city;
  console.log(query);
  dbregional.find(query, function(err, docs){
    if (err) {
      callback({ret: 2});                           // RETURN: 数据库出错
    }
    console.log(docs);
    var area = new Array();
    for(var i=0;i<docs.length;i++){
      area.push(docs[i].prov);
    }
    console.log(area);
    callback({ret: 1, val: area});
  });
}