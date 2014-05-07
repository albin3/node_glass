// 紫外线指数 model.js
var config  = require('../../config');
var mongojs = require('mongojs');
var fs      = require('fs');

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
    return callback({ret: 1, size: doc.size});
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
    return callback({ret: 1});                   // RETURN: 删除成功
  });
};
