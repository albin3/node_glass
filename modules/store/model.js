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
        return callback({ret: 2});                    // RETURN: 返回错误
      }
      return callback({ret: 1, val: doc});            // RETURN: 修改成功
    });
  }else{
    delete store._id;
    if (store.province[store.province.length-1] === "省") {
      store.province = store.province.slice(0, store.province.length-1);
    }
    if (store.municipality[store.municipality.length-1] === "市") {
      store.municipality = store.municipality.slice(0, store.municipality.length-1);
    }
    if (store.area[store.area.length-1] === "县" || store.area[store.area.length-1] === "区") {
      store.area = store.area.slice(0, store.area.length-1);
    }
    var lng = parseFloat(store["store-lng"]) || 0;
    var lat = parseFloat(store["store-lat"]) || 0;
    store.gps = [lng, lat];
    delete store["store-lng"];
    delete store["store-lat"];
    dbstore.insert(store, function(err, doc){
      if (err) {
        return callback({ret: 2});                    // RETURN: 数据库插入出错
      }
      doc._id = doc._id.toString();
      return callback({ret: 1, val: doc});            // RETURN: 新建成功
    });
  }
};

// 查询所有store
exports.allstore = function (req, callback) {
  dbstore.find({lan : req.params.lan}, function(err,docs){
    if (err) {
      callback({ret: 2});                             // RETURN: 数据库出错
    }                                          
    callback({ret: 1, val: docs});                    // RETURN: 查询成功
  });
};

// 查询指定store
exports.toedit = function (req, callback) {
  dbstore.findOne({_id : new ObjectID(req.params.id)}, function(err,docs){
    if (err) {
      callback({ret: 2});                             // RETURN: 数据库出错
    }                                           
    callback({ret: 1, val: docs});                    // RETURN: 查询成功
  });
};

// 删除指定store
exports.delstore = function (store, callback) {
  console.log(store._id);
  dbstore.remove({_id: new ObjectID(store._id)}, function(err){
    if (err) {
      callback({ret: 2});                             // RETURN: 数据库出错
    }                                            
    callback({ret: 1});                               // RETURN: 返回成功
  });
};

// 删除所有
exports.delall = function (req, callback) {
  dbstore.remove({lan : req.params.lan}, function(err){
    if (err) {
      callback({ret: 2});                             // RETURN: 数据库出错
    }                                             
    callback({ret: 1});                               // RETURN: 返回成功
  });
};

// 获取城市
exports.getcity = function (body, callback) {
  dbregional.find({city: body.province}, function(err, docs){
    if (err) {
      return callback({ret: 2});                      // RETURN: 数据库出错
    }
    var city = new Array();
    for(var i=0;i<docs.length;i++){
      if(city.indexOf(docs[i].county)===-1){
        city.push(docs[i].county);
      }
    }
    return callback({ret: 1, val: city});
  });
};

// 获取区县
exports.getarea = function (body, callback) {
  var query = {};
  query.city = body.province;
  query.county = body.city;
  dbregional.find(query, function(err, docs){
    if (err) {
      return callback({ret: 2});                           // RETURN: 数据库出错
    }
    var area = new Array();
    for(var i=0;i<docs.length;i++){
      area.push(docs[i].prov);
    }
    return callback({ret: 1, val: area});
  });
}

// 编辑GPS
exports.editgps = function (req, callback) {
  var id  = req.body.id              || "535a27b66e5a97eb1b135000";
  var lng = parseFloat(req.body.lng) || 0;
  var lat = parseFloat(req.body.lat) || 0;
  dbstore.update({_id: ObjectID(id)}, {$set: {gps: [lng, lat]}}, function(err, updated) {
    if (err) {
      return callback({ret: 2});
    }
    return callback({ret: 1});
  });
}

// 分页获取店铺信息
exports.getStores = function(req, query, callback) {
  var q = {};
  q.lan = query.lan;
  if (req.session && req.session.storesearch && req.session.storesearch != "") {
    eval("q.name = /" + req.session.storesearch + "/;")
    eval("q.address = /" + req.session.storesearch + "/;")
  } else {
    eval("q.name = /./;")
    eval("q.address = /./;")
  }
  console.log(q);
  dbstore.find({lan: q.lan, $or: [{name: q.name}, {address: q.address}]}).sort({class: 1, province: 1, municipality: 1, area: 1, address: 1, name: 1, telephone: -1}).skip((query.skip-1)*query.limit).limit(query.limit, function(err, docs){
    if (err) 
      return callback({ret: 2, val: []});
    else 
      return callback({ret: 1, val: docs});
  });
};

// 获取分页总数
exports.getPages = function(data, callback) {
  var perPage = data.perPage;
  var lan     = data.lan;
  var q = {};
  if (data.storesearch && data.storesearch != "") {
    eval("q.name = /" + data.storesearch + "/;")
    eval("q.address = /" + data.storesearch + "/;")
  } else {
    eval("q.name = /./;")
    eval("q.address = /./;")
  }
  dbstore.count({lan: lan, $or: [{name: q.name}, {address: q.address}]}, function(err, num) {
    if (err) {
      return callback(1);
    }
    return callback(Math.ceil(num/perPage));
  });
};

// 搜索店铺里的数据
exports.search = function(req, res, callback) {
  req.session.storesearch = req.body.storesearch;
  callback({ret: 1});
};
