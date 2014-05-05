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
  var files   = req.files;
  var product = req.body;
  console.log(req.body);
  product.lan = req.params.lan;
  product.image = new Array();
  product.contents = new Array();
  var id = product._id;
  dbproduct.findOne({_id: ObjectID(id)}, function(err, old_prod){
    if (err) {
      return callback({ret: 2});                      // RETURN: 查询数据库错误
    }
    var old_imgs = old_prod.image || [];
    var old_cont = old_prod.contents || [];
    var new_imgs = [];
    var new_cont = [];
    for (var i=0; i<20; i++) {
      if (product["text-"+i]) {
        var text = product["text-"+i];
        delete product["text-"+i];
        new_cont.push(text);
      }
      if (product["picture-"+i] !== undefined) {
        var len = new_imgs.length;
        var img = {};
        img.des = product["picture-"+i];
        if (files["picture"+i] && files["picture"+i].size>0) {
          console.log(files["picture"+i].path);
          fs.renameSync(files["picture"+i].path, config.appPath() + "/static/img/product/picture" + len + id + ".jpg");
          console.log(config.appPath() + "/static/img/product/picture" + len + id + ".jpg");
        } else if (old_imgs[i]) {
          console.log(old_imgs[i]);
          fs.renameSync(config.appPath() + "/static/img/product/picture" + i + id + ".jpg", "/static/img/product/" + len + id + ".jpg");
        } else {
          return callback({ret: 2});                // RETURN: 没有上传图片
        }
        img.url = ("picture"+len);
        new_imgs.push(img);
        delete product["picture-"+i];
      }
    }
    product.image    = new_imgs;
    product.contents = new_cont;
    product._id = new ObjectID(product._id.toString());
    console.log(product);
    dbproduct.update({_id: new ObjectID(id)}, product, function(err, doc){
      if (err) {
        return callback({ret: 2});                  // RETURN: 更新出错
      }
      return callback({ret: 1});                    // RETURN: 更新成功
    });
  });
  if(id!==''){
    product._id = new ObjectID(id);
    return callback({ret: 2});
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
function saveimage(files, doc){
  if (!doc.image) {
    doc.image = [];
  }
  for(var i=0;i<doc.image.length;i++){
    var s = doc.image[i].url;
    if (judge_size(files[s].size)) { var path = config.appPath() + "/static/img/product/" + s + doc._id + ".jpg"; fs.renameSync(files[s].path,path);
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
  dbproduct.findOne({_id : new ObjectID(req.params.id)}, function(err,doc){
    if (err) {
      callback({ret: 2});                           // RETURN: 数据库出错
    }
    if (!doc.image) {
      doc.image = [];
    }
    for (var i=0; i<doc.image.length; i++)
      doc.image[i].url = "/img/product/" + doc.image[i].url + doc._id.toString() + ".jpg";
    callback({ret: 1, val: doc});                   // RETURN: 返回成功
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
      return callback({ret: 2});                                                // RETURN: 错误
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
        return callback(data);                                                  // RETURN: 调用错误
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
      dbstore.count({lan: req.params.lan}, function(err, count){
        if (err) {
          return callback({ret: 2});                                            // RETURN: 调用错误
        }
        var totalPages = Math.ceil(count/20);
        return callback({ret: 1, val: show_stores, totalPages: totalPages});    // RETURN: 调用成功
      });
    });
  });
}
// 分页获取店铺信息
exports.storesinpage = function(req, callback){
  var page   = parseInt(req.params.page_num);
  var lan    = req.params.lan;
  var prodid = req.body._id;
  dbstore.find({lan: lan}).skip((page-1)*20).limit(20, function(err, docs){
    if (err) {
      return callback({ret: 2});                                                // RETURN: 调用错误
    }
    dbproduct.findOne({_id: new ObjectID(prodid)}, function(err, doc){
      if (err || !doc) {
        return callback({ret: 2});                                             // RETURN: 调用错误
      }
      if (!doc.stores) {
        doc.stores   = [];
        doc.discount = [];
      }
      var show_stores = docs;
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
      return callback({ret: 1, val: show_stores});                              // RETURN: 调用成功
    });
  });
};
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

// 上传视频文件
exports.uploadmovies =  function (req, callback) {
  if (req.files["video"].size !== 0) {
    var defaultpath = config.appPath() + "/static/movies/video";
    fs.rename(req.files["video"].path, defaultpath + req.params.lan +".mp4", function(err){});
  }
  callback({ret: 1});                             // RETURN: 返回成功
};
