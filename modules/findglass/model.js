// 紫外线指数 model.js
var config  = require('../../config');
var mongojs = require('mongojs');
var fs      = require('fs');

var db = mongojs(config.dbinfo.dbname);
var dbfindglass = db.collection('findglasspic');
var ObjectID = require('mongodb').ObjectID;

exports.allpics = function(callback) {
  dbfindglass.find({}).sort({_id: -1}, function(err, docs){
    if (err)  
      docs = new Array();
    callback(docs);
  });
};

exports.newpic = function(req, callback) {
  var picwidth    = parseInt(req.body["pic-width"]);
  var picheight   = parseInt(req.body["pic-height"]);
  var glassx      = parseInt(req.body["glass-x"]);
  var glassy      = parseInt(req.body["glass-y"]);
  var glasswidth  = parseInt(req.body["glass-width"]);
  var glassheight = parseInt(req.body["glass-height"]);
  dbfindglass.insert({
    picwidth   : picwidth,
    picheight  : picheight,
    glassx     : glassx,
    glassy     : glassy,
    glasswidth : glasswidth,
    glassheight: glassheight,
    dt         : new Date().getTime()
  }, function(err, doc){
    fs.renameSync(req.files["upload"].path, config.appPath()+"/static/img/findglass/"+doc._id.toString()+".jpg");
    callback({ret: 1});
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
