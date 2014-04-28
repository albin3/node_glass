// model.js product
var config = require('../../config');
var mongojs = require('mongojs');
var fs = require("fs");

var db = mongojs(config.dbinfo.dbname);
var dbproduct = db.collection('product');
var dbstore   = db.collection('store');
var ObjectID = require('mongodb').ObjectID;

var store_model = require('../store/model');

// 新建product
exports.newproduct = function (req, callback) {
  var files = req.files;
  var product = req.body;
  product.lan = req.params.lan;
  product.image = new Array();
  product.contents = new Array();
  var id = product._id;
  for(pro in product){
    if(pro.toString().indexOf("pic")!==-1){ 
      var temp = {};
      temp.des = product[pro];  
      temp.url = pro;
      product.image.push(temp);
      delete product[pro]; 
    }else if(pro.toString().indexOf("text")!==-1){
      product.contents.push(product[pro]);
      delete product[pro];
    }
  }
  console.log("*******************");
  console.log(product);
  console.log("*******************");
  
  if(id!==''){
    product._id = new ObjectID(id);
    dbproduct.update({_id : product._id}, product, function(err, doc){
      if(err){
        return callback({ret: 2});                    // RETURN: 编辑商品出错
      }
      saveimage(files,doc);
      return callback({ret: 1, val: doc});            // RETURN: 编辑商品成功
    });
  }else{
    delete product._id;
    dbproduct.insert(product, function(err, doc){
      if (err) {
        return callback({ret: 2});                    // RETURN: 新建商品出错
      }
      saveimage(files,doc);
      doc._id = doc._id.toString();
      return callback({ret: 1, val: doc});            // RETURN: 新建商品成功
    });
  }
};
function saveimage(files,doc){
  for(var i=0;i<doc.image.length;i++){
    var s = doc.image[i].url;
    if (judge_size(files[s].size)) { 
      var path = config.appPath() + "/static/img/product/" + s + doc._id + ".jpg";
      fs.renameSync(files[s].path,path);
    }
  }
}
// 限制上传的图片的大小，阈值可以在config中设置
function judge_size(size) {
  return size > 0 && size < config.pic_size;
}

// 查询所有product
exports.allproduct = function (req, callback) {
  dbproduct.find({lan : req.params.lan}, function(err,docs){
    if (err) {
      callback({ret: 2});                           // RETURN: 数据库出错
    }
    callback({ret: 1, val: docs});                  // RETURN: 返回成功
  });
};

// 查询指定product
exports.toedit = function (req, callback) {
  dbproduct.findOne({_id : new ObjectID(req.params.id)}, function(err,docs){
    if (err) {
      callback({ret: 2});                           // RETURN: 数据库出错
    }
    callback({ret: 1, val: docs});                  // RETURN: 返回成功
  });
};

// 删除指定product
exports.delproduct = function (product, callback) {
  dbproduct.remove({_id: new ObjectID(product._id)}, function(err){
    if (err) {
      callback({ret: 2});                           // RETURN: 数据库出错
    }
    callback({ret: 1});                             // RETURN: 返回成功
  });
};

// 删除所有
exports.delall = function (req, callback) {
  dbproduct.remove({lan : req.params.lan}, function(err){
    if (err) {
      callback({ret: 2});                           // RETURN: 数据库出错
    }
    callback({ret: 1});                             // RETURN: 返回成功
  });
};

// ####################店铺关联产品操作##################
// 引用store管理里面的函数
exports.getStores = function(req, callback){
  dbproduct.findOne({_id: new ObjectID(req.params.id)}, function(err, doc){
    if (err) {
      return callback({ret: 2});                    // RETURN: 错误
    }
    if (!doc.stores) {
      doc.stores   = [];
      doc.discount = [];
    }
    var query   = {};
    query.lan   = req.params.lan;
    query.skip  = 0;
    query.limit = 15;
    store_model.getStores(query, function(data){
      if (data.ret !== 1) {
        return callback(data);                     // RETURN: 调用错误
      }
      var show_stores = data.val;
      for (var i=0; i<show_stores.length; i++) {
        var obj      = show_stores[i];
        obj.sale     = false;
        obj.discount = false;
        for (var j=0; j<doc.stores.length; j++) {
          if (obj._id.toString() === doc.stores[j]) {
            obj.sale     = true;
            obj.discount = doc.discount[j];
          }
        }
      }
      console.log(show_stores);
      return callback({ret: 1, val: show_stores});    // RETURN: 调用成功
    });
  });
}

// 删除数组中元素
Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};
// 产品关联的店铺操作
exports.sale = function(req, callback) {
  var query = req.body;
  dbproduct.findOne({_id: new ObjectID(query.prodid)}, function(err, doc){
    if (err) {
      return callback({ret: 2});                    // RETURN: 错误
    }
    if (doc.stores === undefined) {
      doc.stores   = [];//商店列表
      doc.discount = [];//促销列表
    }
    if (query.checked === "true") {
      doc.stores.push(query.storeid);
      doc.discount.push(false);
    } else if(query.checked === "false"){
      var stores = doc.stores;
      for (var i=0; i<stores.length; i++) {
        if (stores[i] === query.storeid) {
          doc.stores.remove(i);
          doc.discount.remove(i);
          break;
        }
      }
    } else {
      console.log(query.checked);
    }
    dbproduct.update({_id: new ObjectID(query.prodid)}, doc, function(err, docs){
      if (err) {
        return callback({ret: 2});
      }
      return callback({ret: 1});
    });
  });
};
// 店铺促销
exports.discount = function(req, callback) {
  var query = req.body;
  dbproduct.findOne({_id: new ObjectID(query.prodid)}, function(err, doc){
    if (err) {
      return callback({ret: 2});                    // RETURN: 错误
    }
    if (doc.stores === undefined) {
      doc.stores   = [];//商店列表
      doc.discount = [];//促销列表
    }
    var stores = doc.stores;
    for (var i=0; i<stores.length; i++) {
      if (stores[i] === query.storeid) {
        if (query.checked === "true") {
          doc.discount[i] = true;
        } else if(query.checked === "false") {
          doc.discount[i] = false;
        }
      }
    }
    dbproduct.update({_id: new ObjectID(query.prodid)}, doc, function(err, docs){
      if (err) {
        return callback({ret: 2});                // RETURN: 修改失败
      }
      return callback({ret: 1});                  // RETURN: 修改成功
    });
  });
};
