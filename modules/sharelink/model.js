// model.js sharelink

// 分享链接
exports.sharelink = function(req, callback){
  var userid = req.params.userid;
  var language = req.params.lan;
  dbversion.findOne({lan: language}, function(err, doc){
    if (err || !doc) {
      return callback({ret: 1}, "/apk/Essilor_simplified.apk");
    }
    db_user.update({_id: new ObjectID(userid)}, {$inc: {clicknum: 1}}, function(err){
      return callback({ret: 1}, doc.url);
    });
  });
};

// 分享的链接
exports.sharepage = function(req, callback) {
  return callback({ret: 1});
}

