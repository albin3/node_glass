// 紫外线指数 model.js
var config  = require('../../config');
var mongojs = require('mongojs');
var fs      = require('fs');
var plist   = require('plist');

var db = mongojs(config.dbinfo.dbname);
var dbfindglass = db.collection('findglasspic');
var ObjectID = require('mongodb').ObjectID;

exports.allpics = function(req, callback) {
  var sizetype = parseInt(req.body.size);
  if (isNaN(sizetype)) {
    sizetype = 1;
  }
  console.log({ lan: req.params.lan, size: sizetype });
  dbfindglass.find({ lan: req.params.lan, size: sizetype }).sort({_id: -1}, function(err, docs){
    if (err)  
      docs = new Array();
    return callback({ret: 1, docs: docs, size: sizetype});
  });
};

exports.newpic = function(req, callback) {
  var picsize     = parseInt(req.body["pic-size"]);
  var picwidth    = parseInt(req.body["pic-width"]);
  var picheight   = parseInt(req.body["pic-height"]);
  var glassx      = parseInt(req.body["glass-x"]);
  var glassy      = parseInt(req.body["glass-y"]);
  var glasswidth  = parseInt(req.body["glass-width"]);
  var glassheight = parseInt(req.body["glass-height"]);
  dbfindglass.insert({
    size       : picsize,
    picwidth   : picwidth,
    picheight  : picheight,
    glassx     : glassx,
    glassy     : glassy,
    glasswidth : glasswidth,
    glassheight: glassheight,
    dt         : new Date().getTime(),
    lan        : req.params.lan
  }, function(err, doc){
    fs.renameSync(req.files["upload"].path, config.appPath()+"/static/img/findglass/"+doc._id.toString()+".jpg");
    dbfindglass.find({ lan: req.params.lan, size: doc.size }, function(err, docs){
      var pList = {};
      pList["Resources Ready"] = false;
      var Images = [];
      for (var i=0; i<docs.length; i++) {
        var picObj = {};
        picObj.Filename = docs[i]._id.toString()+".jpg";
        picObj.Url      = "http://183.61.111.193:3006/img/findglass/"
        picObj.Width    = docs[i].picwidth;
        picObj.Height   = docs[i].picheight;
        picObj.Rect     = {
          X     :   docs[i].glassx,
          Y     :   docs[i].glassy,
          W     :   docs[i].glasswidth,
          H     :   docs[i].glassheight
        };
        Images.push(picObj);
      }
      pList.Images = Images;
      var str_plist = plist.build(pList).toString();
      fs.writeFile(config.appPath()+"/static/img/findglass/pics"+doc.size+".plist", str_plist, function(err){
        if (err) {
          console.log("产生plist文件出错!");
        }
        console.log("产生plist文件成功!");
      });
    });
    return callback({ret: 1, size: doc.size});  // RETURN: 返回跳转
  });
};

exports.delpic = function(req, callback) {
  dbfindglass.remove({_id: new ObjectID(req.id)}, function(err){
    if (err) {
      return callback({ret: 2});                 // RETURN: 删除失败
    }
    try{
      fs.unlink(config.appPath()+"/static/img/findglass/"+doc._id.toString()+".jpg", function(err){});
    } catch (e){
    }
    dbfindglass.find({ lan: req.lan, size: parseInt(req.size) }, function(err, docs){
      var pList = {};
      pList["Resources Ready"] = false;
      var Images = [];
      for (var i=0; i<docs.length; i++) {
        var picObj = {};
        picObj.Filename = docs[i]._id.toString()+".jpg";
        picObj.Url      = "http://183.61.111.193:3006/img/findglass/"
        picObj.Width    = docs[i].picwidth;
        picObj.Height   = docs[i].picheight;
        picObj.Rect     = {
          X     :   docs[i].glassx,
          Y     :   docs[i].glassy,
          W     :   docs[i].glasswidth,
          H     :   docs[i].glassheight
        };
        Images.push(picObj);
      }
      pList.Images = Images;
      var str_plist = plist.build(pList).toString();
      fs.writeFile(config.appPath()+"/static/img/findglass/pics"+req.size+".plist", str_plist, function(err){
        if (err) {
          console.log("产生plist文件出错!");
        }
        console.log("产生plist文件成功!");
      });
    });
    return callback({ret: 1});                   // RETURN: 删除成功
  });
};
