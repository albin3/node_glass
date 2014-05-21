// model.js product
var config = require('../../config');
var mongojs = require('mongojs');
var fs = require("fs");
var store_model = require('../store/model');
var pushlib = require('../pushlib/model');      // 推送

var db = mongojs(config.dbinfo.dbname);
var dbproduct = db.collection('product');
var dbstore   = db.collection('store');
var dbbrand   = db.collection('brand');
var ObjectID = require('mongodb').ObjectID;

// 新建product
exports.newproduct = function (req, callback) {
  var files   = req.files;
  var product = req.body;
  product.lan = req.params.lan;
  // product["sc-remain"] = parseInt(product["sc-remain"]);
  // if (isNaN(product["sc-remain"])) {
  //   product["sc-remain"] = 10000;
  // }
  product.nc_enable = false;
  if (product["nc-content"]) {
    product.nc_enable = true;
  }
  product.sc_enable = false;
  if (product["sc-content"]) {
    product.sc_enable = true;
  }
  product.image     = new Array();
  product.contents  = new Array();
  var id = product._id;
  if(id!==''){
    dbproduct.findOne({_id: ObjectID(id)}, function(err, old_prod){
      if (err) {
        return callback({ret: 2});                      // RETURN: 查询数据库错误
      }
      var old_imgs = old_prod.image || [];
      var old_cont = old_prod.contents || [];
      var new_imgs = [];
      var new_cont = [];
      for (var i=0; i<90; i++) {
        if (product["text-"+i]) {
          var text = product["text-"+i];
          delete product["text-"+i];
          new_cont.push(text);
        }
      }
      if (files["listpic"] && files["listpic"].size>0) {
        fs.renameSync(files["listpic"].path, config.appPath() + "/static/img/product/" + id + ".jpg");
      }
      for (var i=0; i<20; i++) {
        if (product["picture"+i] !== undefined) {
          var len = new_imgs.length;
          var img = {};
          img.des = product["picture"+i];
          if (files["picture"+i] && files["picture"+i].size>0) {
            fs.renameSync(files["picture"+i].path, config.appPath() + "/static/img/product/picture" + len + id + ".jpg");
          } else if (old_imgs[i]) {
            fs.renameSync(config.appPath() + "/static/img/product/picture" + i + id + ".jpg", config.appPath() + "/static/img/product/picture" + len + id + ".jpg");
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
      product._id      = new ObjectID(product._id.toString());
      product.dt       = new Date().getTime();
      product.stores   = old_prod.stores;
      product.discount = old_prod.discount;
      dbproduct.update({_id: new ObjectID(id)}, product, function(err, doc){
        if (err) {
          return callback({ret: 2});                  // RETURN: 更新出错
        }
        return callback({ret: 1, val: product});      // RETURN: 更新成功
      });
    });
  }else{
    delete product._id;
    product.dt       = new Date().getTime();
    dbproduct.insert(product, function(err, old_prod){
      if (err) {
        return callback({ret: 2});                    // RETURN: 新建商品出错
      }
      id = old_prod._id.toString();
      var old_imgs = old_prod.image || [];
      var old_cont = old_prod.contents || [];
      var new_imgs = [];
      var new_cont = [];
      for (var i=0; i<90; i++) {
        if (product["text-"+i]) {
          var text = product["text-"+i];
          delete product["text-"+i];
          new_cont.push(text);
        }
      }
      if (files["listpic"] && files["listpic"].size>0) {
        fs.renameSync(files["listpic"].path, config.appPath() + "/static/img/product/" + id + ".jpg");
      }
      for (var i=0; i<20; i++) {
        if (product["picture"+i] !== undefined) {
          var len = new_imgs.length;
          var img = {};
          img.des = product["picture"+i];
          if (files["picture"+i] && files["picture"+i].size>0) {
            fs.renameSync(files["picture"+i].path, config.appPath() + "/static/img/product/picture" + len + id + ".jpg");
          } else if (old_imgs[i]) {
            fs.renameSync(config.appPath() + "/static/img/product/picture" + i + id + ".jpg", config.appPath() + "/static/img/product/picture" + len + id + ".jpg");
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
      product._id      = new ObjectID(product._id.toString());
      product.dt       = new Date().getTime();
      dbproduct.update({_id: new ObjectID(id)}, product, function(err, doc){
        if (err) {
          return callback({ret: 2});                  // RETURN: 更新出错
        }
        return callback({ret: 1, val: product});      // RETURN: 更新成功
      });
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
  dbproduct.find({lan : req.params.lan}).sort({brand: 1, dt: -1}, function(err,docs){
    if (err) {
      return callback({ret: 2});                           // RETURN: 数据库出错
    }
    return callback({ret: 1, val: docs});                  // RETURN: 返回成功
  });
};

// 查询指定product
exports.toedit = function (req, callback) {
  dbproduct.findOne({_id : new ObjectID(req.params.id)}, function(err,doc){
    if (err) {
      return callback({ret: 2});                           // RETURN: 数据库出错
    }
    if (!doc.image) {
      doc.image = [];
    }
    for (var i=0; i<doc.image.length; i++)
      doc.image[i].url = "/img/product/" + doc.image[i].url + doc._id.toString() + ".jpg";
    return callback({ret: 1, val: doc});                   // RETURN: 返回成功
  });
};

// 删除指定product
exports.delproduct = function (product, callback) {
  dbproduct.remove({_id: new ObjectID(product._id)}, function(err){
    if (err) {
      return callback({ret: 2});                           // RETURN: 数据库出错
    }
    return callback({ret: 1});                             // RETURN: 返回成功
  });
};

// 删除所有
exports.delall = function (req, callback) {
  dbproduct.remove({lan : req.params.lan}, function(err){
    if (err) {
      return callback({ret: 2});                           // RETURN: 数据库出错
    }
    return callback({ret: 1});                             // RETURN: 返回成功
  });
};

// ####################店铺关联产品操作##################
// 删除数组中元素
Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};
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
    query.skip  = 1;
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
            break;
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
// 产品关联的店铺操作
exports.sale = function(req, callback) {
  var query = req.body;
  dbproduct.findOne({_id: new ObjectID(query.prodid)}, function(err, doc){
    if (err) {
      return callback({ret: 2});                    // RETURN: 错误
    }
    if (!doc.stores) {
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
// 产品关联的批量店铺操作
exports.salelist = function(req, callback) {
  var query      =  req.body || {};
  var storelist  =  query.storelist || [];
  dbproduct.findOne({_id: new ObjectID(query.prodid)}, function(err, doc) {
    if (err) {
      return callback({ret: 2});                    // RETURN: 错误
    }
    if (!doc.stores) {
      doc.stores   = [];//商店列表
      doc.discount = [];//促销列表
    }
    if (query.checked === "true") {
      for (var i=0; i<storelist.length; i++) {
        var exist = false;
        for(var j=0; j<doc.stores.length; j++) {
          if (storelist[i] === doc.stores[j]) {
            exist = true;
            break;
          }
        }
        if (!exist) {
          doc.stores.push(storelist[i]);
          doc.discount.push(false);
        }
      }
    } else if(query.checked === "false"){  // 删除
      for (var i=0; i<storelist.length; i++) {
        var exist = false;
        for(var j=0; j<doc.stores.length; j++) {
          if (storelist[i] === doc.stores[j]) {
            exist = true;
            break;
          }
        }
        if (exist) {
          doc.stores.remove(j);
          doc.discount.remove(j);
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

// 获取品牌列表
exports.getbrands = function(req, callback) {
  dbbrand.find({lan: req.params.lan}, function(err, docs){
    if (err || docs===0) {
      return callback(["No brands added"]);
    }
    var brand = [];
    for (var i=0; i<docs.length; i++) {
      brand.push(docs[i].name);
    }
    callback(brand);
  });
};

// 推送指定product
exports.pushproduct = function (product, callback) {
  dbproduct.findOne({_id: new ObjectID(product._id)}, function(err, doc){
    if (err) {
      return callback({ret: 2});                           // RETURN: 数据库出错
    }
    var lan = doc.lan;
    pushlib.AndroidPush.pushAll({lan: lan, content: "prod/"+doc._id.toString()+"/"+doc.name+"/"+"click.", message: "message"});
    pushlib.ApplePush.pushAll({lan: lan, message: doc._id.toString(), alert: doc.name, content: "prod"});
    return callback({ret: 1});                             // RETURN: 返回推送成功
  });
};

// 分页获取产品信息
exports.getProducts = function(query, callback) {
  dbproduct.find({lan: query.lan}).sort({brand: 1, dt: -1}).skip((query.skip-1)*query.limit).limit(query.limit, function(err, docs){
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
  dbproduct.count({lan: lan}, function(err, num) {
    if (err) {
      return callback(1);
    }
    return callback(Math.ceil(num/perPage));
  });
};
