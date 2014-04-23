// model.js product
var config = require('../../config');
var mongojs = require('mongojs');
var fs = require("fs");

var db = mongojs(config.dbinfo.dbname);
var dbproduct = db.collection('product');
var ObjectID = require('mongodb').ObjectID;

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
        return callback({ret: 2});
      }
      saveimage(files,doc);
      return callback({ret: 1, val: doc}); 
    });
  }else{
    delete product._id;
    dbproduct.insert(product, function(err, doc){
      if (err) {
        return callback({ret: 2});                    // RETURN: 数据库插入出错
      }
      saveimage(files,doc);
      doc._id = doc._id.toString();
      return callback({ret: 1, val: doc});            // RETURN: 插入成功
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
