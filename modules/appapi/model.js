// appapi model.js
var config = require('../../config');
var mongojs = require('mongojs');
var password_hash = require('password-hash');
var db = mongojs(config.dbinfo.dbname);

var db_user         = db.collection('appuser');
var db_news         = db.collection('news');
var db_workerid     = db.collection('workerid');
var db_uvcatcher    = db.collection('uvcatcher');     // Games
var db_findglass    = db.collection('findglass');     // Games
var db_findglasspic = db.collection('findglasspic');  // Games
var db_coupon       = db.collection('coupon');
var db_pra_coupon   = db.collection('couponpravided');
var db_regional     = db.collection('regional');
var db_store        = db.collection('store');
var db_slide        = db.collection('slide');
var db_brand        = db.collection('brand');
var db_product      = db.collection('product');
var db_tips          = db.collection('tips');
var ObjectID        = require('mongodb').ObjectID;

/**
 * 新用户注册
 */
exports.newuser = function (user, callback) {

  if (user.tel === undefined && user.email === undefined && user.thirdpath === undefined) {
    return callback({ret: 2});
  }
  if (!user.workerid) {     // 初始化
    user.workerid = "";
  }
  // 验证员工号码
  user.isworker = 0;
    db_workerid.findOne({index: user.workerid.toUpperCase()}, function (err, doc) {
      if (err || !doc) {
        if (user.workerid !== undefined && user.workerid !== ""){
          return callback({ret: 3});            // RETURN: 员工Id验证错误 
        }
      } else {
        user.isworker = parseInt(doc.level);// 用户可能分等级
      }
      // 插入数据库
      user.password = user.password || "111111";
      user.password = password_hash.generate(user.password);
      user.disable  = false;
      user.sharenum = 0;      // 分享链接的次数
      user.clicknum = 0;      // 链接点击的次数
      user.name     = "unknown";
      user.sex      = "unknown";
      user.age      = "unknown";
      user.job      = "unknown";
      user.location = "unknown";
      user.workerid = "unknown";
      db_user.insert(user, function (err, doc) {
        if (err) {
          return callback({ret: 2});             // RETURN: 注册字段重复
        }
        return callback({                        // RETURN: 注册成功
          ret      : 1, 
          val      : {
          userid   : doc._id.toString(),
          email    : doc.email,
          tel      : doc.tel,
          isworker : doc.isworker,
          name     : doc.name,
          sex      : doc.sex,
          age      : doc.age,
          job      : doc.job,
          location : doc.location
          }
        });
      });
    });
};

/**
 * 用户登录
 */
exports.usersignin = function (user, callback) {
  var query = {};
  switch (parseInt(user.type)) {
    case 1:  query.tel = user.name;
             break;
    case 2:  query.email = user.name;
             break;
    case 3:  query.thirdpath = user.name;
             break;
    default: query.tel = user.name;
             break;
  }
  db_user.findOne(query, function(err, doc){
    if (parseInt(user.type) === 3){
      if (!err && doc) {                        // RETURN: 第三方账号已存在
        return callback({
           ret      : 1,
          val      : {
          userid   : doc._id.toString(),
          email    : doc.email,
          tel      : doc.tel,
          isworker : doc.isworker,
          name     : doc.name,
          sex      : doc.sex,
          age      : doc.age,
          job      : doc.job,
          location : doc.location
          }
        });
      }
      db_user.insert({
        nickname : user.name,
        thirdpath: user.name,
        isworker : 0,
        disable  : false
      },function(err, u){
        return callback({
           ret      : 1,
           val      : {
           userid   : doc._id.toString(),
           email    : doc.email,
           tel      : doc.tel,
           isworker : doc.isworker,
           name     : doc.name,
           sex      : doc.sex,
           age      : doc.age,
           job      : doc.job,
           location : doc.location
          }
        });
      });
    } else {
      if (err || !doc) {
        return callback({ret: 4});         // RETURN: 账号不存在
      }
      if (doc.disable) {
        return callback({ret: 3});         // RETURN: 账号被停封
      }
      // 第三方登录不验证密码
      if (parseInt(user.type) !== 3 &&
          !password_hash.verify(user.password, doc.password)){
        return callback({ret: 2});         // RETURN: 账号密码不正确
      }
      return callback({                    // RETURN: 账号密码正确
        ret      : 1,
        val      : {
        userid   : doc._id.toString(),
        email    : doc.email,
        tel      : doc.tel,
        isworker : doc.isworker,
        name     : doc.name,
        sex      : doc.sex,
        age      : doc.age,
        job      : doc.job,
        location : doc.location
       } 
      });
    }
  });
};

/**
 * 修改用户密码
 */
exports.chpassword = function (user, callback) {
  var query = {_id: new ObjectID(user.userid)};

  db_user.findOne(query, function(err, doc){
    if (err || !doc) {
      return callback({ret: 4});         // RETURN: 账号不存在
    }
    if (doc.disable) {
      return callback({ret: 3});         // RETURN: 账号被停封
    }
    if (!password_hash.verify(user.oldpsd, doc.password)){
      return callback({ret: 2});         // RETURN: 账号密码不正确
    }

    doc.password = password_hash.generate(user.newpsd);
    db_user.update(query, doc, function(err, updated){
      if(err) {
        return callback({ret: 5});       // RETURN: 数据库错误
      }
      return callback({                           // RETURN: 账号密码正确
             ret      : 1,
             val      : {
             userid   : doc._id.toString(),
             email    : doc.email,
             tel      : doc.tel,
             isworker : doc.isworker,
             name     : doc.name,
             sex      : doc.sex,
             age      : doc.age,
             job      : doc.job,
             location : doc.location
            } 
      });
    });
  });
};

/**
 * 重置用户密码
 */
exports.resetpassword = function (user, callback) {
  var query = {_id: new ObjectID(user.userid)};

  db_user.findOne(query, function(err, doc){
    if (err || !doc) {
      return callback({ret: 4});         // RETURN: 账号不存在
    }
    if (doc.disable) {
      return callback({ret: 3});         // RETURN: 账号被停封
    }

    var Num = "";
    for (var i = 0; i < 6; i++) {
      Num += Math.floor(Math.random()*10);
    }
    doc.password = password_hash.generate(Num);
    db_user.update(query, doc, function(err, updated){
      if(err) {
        return callback({ret: 5});       // RETURN: 数据库错误
      }
      return callback({                           // RETURN: 账号密码正确
             ret      : 1,
             userid   : doc._id.toString(),
             isworker : doc.isworker,
             password : Num
      });
    });
  });
};

/**
 * 修改用户信息
 */
exports.updateuser = function (req, callback) {
  var query = {_id: new ObjectID(req.params.userid)};
  var user = req.body;

  db_user.findOne(query, function(err, mid){
    if (err || !mid) {
      return callback({ret: 4});         // RETURN: 账号不存在
    }
    if (mid.disable) {
      return callback({ret: 3});         // RETURN: 账号被封停
    }
    
    mid.tel = user.tel || mid.tel;
    mid.email = user.email || mid.email;
    mid.sex = user.sex || mid.sex;
    mid.isworker = user.isworker || user.isworker;
    mid.name     = user.name     || user.name;
    mid.age      = user.age      || user.age;
    mid.job      = user.job      || user.job;
    mid.location = user.location || user.location;
    db_user.update(query, mid, function(err, doc){
      if (err) {
        return callback({ret: 2});       // RETURN: 邮箱或手机号已经被使用
      }
      return callback({                  // RETURN: 修改成功
             ret      : 1,
             val      : {
             userid   : doc._id.toString(),
             email    : doc.email,
             tel      : doc.tel,
             isworker : doc.isworker,
             name     : doc.name,
             sex      : doc.sex,
             age      : doc.age,
             job      : doc.job,
             location : doc.location
            } 
      });
    });
  });
};


// ###新闻接口
// 新闻列表
exports.pagednews = function (req, callback) {
  var numPerPage = parseInt(req.params.numPerPage);
  var pageNum = parseInt(req.params.pageNum);
  db_news.find({lan: req.params.lan}).sort({time: -1}).limit(numPerPage).skip(numPerPage*(pageNum-1), function(err, docs){
    if (err){
      return callback({ret: 2});                                //RETURN: 查询出错
    }
    for (var index=0; index<docs.length; index++) {
      docs[index]._id = docs[index]._id.toString();
      delete docs[index].details;
      delete docs[index].focus;
      delete docs[index].url;
      delete docs[index].lan;
      docs[index].pic = "/img/news/" + docs[index]._id + ".jpg";
    }
    return callback({ret: 1, num:docs.length, list: docs});      // RETURN: 返回成功
  });
};
// 新闻焦点图
exports.slide = function (req, callback) {
  num = req.params.num;
  db_slide.find({lan: req.params.lan}).limit(parseInt(num), function(err, docs){
    if (err){
      return callback({ret: 2});                                // RETURN: 查询出错
    }
    var listnum = 0;
    var imglist = new Array();
    for (var i=0; i<docs.length; i++) {
      imglist.push({
        _id   : docs[i]._id.toString(),
        title   : docs[i].title,
        summary : docs[i].summary,
        url     : docs[i].url,
        picture   : "/img/slide/" + docs[i]._id.toString() + ".jpg"
      });
      listnum += 1;
    }
    return callback({ret: 1, num: listnum, list: imglist});     // RETURN: 返回成功
  });
};
// 新闻详情
exports.newsdetails = function (req, callback) {
  var newsid = req.params.newsid;
  db_news.findOne({_id: new ObjectID(newsid)}, function(err, doc){
    if (err){
      return callback({ret: 3});                                // RETURN: 查询出错
    }
    if (!doc){
      return callback({ret: 2});                                // RETURN: 新闻已经已经被删除
    }

    doc._id = doc._id.toString();
    delete doc.url;
    delete doc.firpicdes;
    return callback({ret: 1, obj: doc});                        // RETURN: 返回成功
  });
};

// ###游戏接口
// 紫外线收割机
exports.uvcatcher = function(req, callback) {
  var data     = req.body;
  var id       = data._id;
  var nickname = data.nickname || "none";
  var score    = parseInt(data.score) || 0;
  db_uvcatcher.update({userid: id, lan: req.params.lan}, 
      {$set: {userid: id}, $set:{nickname: nickname}, $set:{score: score}},
      {upsert: true}, function(err, doc) {
    if (err || !doc) {
      return callback({ret: 2});                               // RETURN: 返回更新错误
    }
    return callback({ret: 1});                                 // RETURN: 返回更新成功
  });
};
// 紫外线收割机排行
exports.uvrank = function(req, callback) {
  console.log("hear this");
  db_uvcatcher.find({lan: req.params.lan}).sort({score: -1}).limit(8,function(err, docs){
    if (err || docs.length === 0) {
  console.log("hear this 2");
      return callback({ret: 2});                               // RETURN: 返回获取错误
    }
  console.log("hear this 3");
    return callback({ret: 1, rank: docs});                     // RETURN: 返回获取成功
  });
};
// 寻找黄眼镜
exports.findglass = function(req, callback) {
  var data     = req.body;
  var id       = data._id;
  var nickname = data.nickname;
  var score    = parseInt(data.score) || 100000;
  db_findglass.update({userid: id, lan: req.params.lan},
      {$set:{userid: id}, $set:{nickname: nickname}, $set:{score: score}},
      {upsert: true}, function(err, doc){
    if (err || !doc) {
      return callback({ret: 2});                               // RETURN: 返回更新错误
    }
    return callback({ret: 1});                                 // RETURN: 返回更新成功
  });
};
// 寻找黄眼镜获取图片数据
exports.findglasspulldata = function(req, callback) {
  db_findglasspic.find({dt: {$gt: parseInt(req.params.timestamp)}, lan: req.params.lan}).sort({_id: -1},function(err, docs){
    if (err || docs.length===0) {
      return callback({ret: 2});                               // RETURN: 返回更新错误
    }
    return callback({ret: 1, pics: docs});                     // RETURN: 返回更新成功
  });
};
// 获取寻找晃眼睛排行榜
exports.fgrank = function(req, callback) {
  db_findglass.find({lan: req.params.lan}).sort({score: 1}).limit(8,function(err, docs){
    if (err || docs.length === 0) {
      return callback({ret: 2});                               // RETURN: 返回获取错误
    }
    return callback({ret: 1, rank: docs});                     // RETURN: 返回获取成功
  });
};
// ###优惠券
// 获得优惠券
exports.getcoupon = function(req, callback) { 
  var data     = req.body;
  var userid   = data._id;
  var isworker = data.isworker;
  if (isNaN(isworker)) {
    isworker = 1;
  }
  if (isworker > 1) {
    isworker = 10;
  } else {
    isworker = 1;
  }
  var gotcoupon = false;
  db_coupon.find({lan: req.params.lan}, function(err, docs) { 
    for (var i=0; i<docs.length; i++) {
      var doc = docs[i];
      if (Math.random() >= parseFloat('0.' + doc.off)*isworker) {    // 概率产生优惠券
        continue;
      }
      doc.pravided = doc.pravided + 1;
      db_coupon.update({_id: doc._id}, doc, function(err, msg){
        if (err) {
          return callback({ret: 3});                            // RETURN: 数据库错误
        }
        var couponkey = doc.index + (Array(8).join(0) + doc.pravided).slice(-8);
        // 生成四位随机数
        for (var i=0; i<4; i++) {
          couponkey += parseInt(Math.random()*10);
        }
        db_pra_coupon.insert({
          couponkey : couponkey,
          userid    : userid,
          coupon    : doc
        }, function(err, rtn_doc) {
          if (err) {
            return callback({ret: 3});                          // RETURN: 数据库错误
          }
          return callback({ret: 1, couponkey: couponkey});      // RETURN: 产生优惠券
        });
      });
      gotcoupon = true;   // 异步执行，所以需要标志位
      break;
    }
    if (gotcoupon === false)
      return callback({ret: 2});                                // RETURN: 没有产生优惠券
  });
};

// 验证优惠券
exports.checkcoupon = function(req, callback) { 
  var data      = req.body;
  var couponkey = data.couponkey || "null";
  db_pra_coupon.findOne({couponkey: couponkey, isdeleted: null, lan: req.params.lan}, function(err, doc) { 
    if (err || !doc) {
      return callback({ret: 2});                                // RETURN: 优惠券不存在
    }
    return callback({ret: 1});                                  // RETURN: 优惠券存在
  });
};

// 使用优惠券
exports.usecoupon = function(req, callback) { 
  var data      = req.body;
  var couponkey = data.couponkey || "not a couponkey";
  var couponid  = couponkey.slice(0,5);
  db_coupon.findOne({index: couponid, lan: req.params.lan},function(err, doc){
    if (err || !doc) {
      return callback({ret: 6});                                // RETURN: 这类优惠券不存在
    } else if (doc.time < new Date()) {
      return callback({ret: 5});                                // RETURN: 这类优惠券已过期
    }
    db_pra_coupon.findOne({couponkey: couponkey, lan: req.params.lan}, function(err, doc) { 
      if (err || !doc) {
        return callback({ret: 4});                              // RETURN: 这张优惠券不存在
      }
      if (doc.isdeleted) {
        return callback({ret: 3});                              // RETURN: 这张优惠券已使用
      }
      db_pra_coupon.update({couponkey: couponkey, lan: req.params.lan}, {$set: {isdeleted: true}}, function(err, data){
        if (err) {
          return callback({ret: 2});                            // RETURN: 优惠券使用失败
        }
        return callback({ret: 1});                              // RETURN: 这张优惠券使用成功
      });
    });
  });
};

// 优惠券列表(用户)
exports.couponlist = function(req, callback) { 
  var data   = req.body;
  var userid = data.userid;
  db_pra_coupon.find({userid: userid, isdeleted: {$not: {$gte: true}}}, function(err, docs) { 
    if (err) {
      return callback({ret: 2});                                // RETURN: 查询错误
    }
    var couponlist = new Array();
    for (var i in docs) {
      var doc    = docs[i];
      var coupon = {};
      coupon._id       = doc._id;
      coupon.couponkey = doc.couponkey;
      coupon.userid    = doc.userid;
      coupon.detail    = doc.coupon.detail;
      coupon.index     = doc.coupon.index;
      coupon.off       = doc.coupon.off;
      coupon.name      = doc.coupon.name;
      coupon.range     = doc.coupon.range;
      coupon.time      = new Date(doc.coupon.time).getTime();
      couponlist.push(coupon);
    }
    return callback({ret: 1, couponlist: couponlist});                // RETURN: 优惠券列表
  });
};

// ###门店品牌接口
//获取省，市，区县接口
exports.getprovince = function(req,callback){
  db_regional.find({},function(err, docs){
    if (err) {
      callback({ret: 2});                           // RETURN: 数据库出错
    }
    var province = new Array();
    for(var i=0;i<docs.length;i++){
      if(province.indexOf(docs[i].city)===-1){
        province.push(docs[i].city);
      }     
    }                                   
    callback({ret: 1, val: province});              // RETURN: 返回成功
  });
};
exports.getcity = function(req,callback){
  var body = req.body;
  db_regional.find({city: body.province}, function(err, docs){
    if (err) {
      callback({ret: 2});                           // RETURN: 数据库出错
    }
    var city = new Array();
    for(var i=0;i<docs.length;i++){
      if(city.indexOf(docs[i].county)===-1){
        city.push(docs[i].county);
      }
    }
    callback({ret: 1, val: city});
  });
};
exports.getarea = function(req,callback){
  var body = req.body;
  var query = {};
  query.city = body.province;
  query.county = body.city;
  db_regional.find(query, function(err, docs){
    if (err) {
      callback({ret: 2});                           // RETURN: 数据库出错
    }
    var area = new Array();
    for(var i=0;i<docs.length;i++){
      area.push(docs[i].prov);
    }
    callback({ret: 1, val: area});
  });
};

// 根据省市区获取门店列表，可翻页
exports.store = function (req, callback) {
  var data = req.body;
  var numPerPage = parseInt(data.numPerPage);
  var pageNum = parseInt(data.pageNum);
  var query = {};
  query.province = data.province;
  query.municipality = data.municipality;
  query.area = data.area;
  query.lan = req.params.lan;
  db_store.find(query).limit(numPerPage).skip(numPerPage*(pageNum-1), function(err, docs){
    if (err){
      return callback({ret: 2});                                //RETURN: 查询出错
    }
    for (index in docs) {
      docs[index]._id = docs[index]._id.toString();
      delete docs[index].province;
      delete docs[index].municipality;
      delete docs[index].area;
      delete docs[index].lan;
    }
    return callback({ret: 1, num:docs.length, list: docs});      // RETURN: 返回成功
  });
};
//获取品牌列表
exports.brand = function (req, callback){
  db_brand.find({lan:req.params.lan},function(err,docs){
    if (err) {
      return callback({ret: 2});                                // RETURN: 查询错误
    }
    var brand = new Array();
    var temp = new Array();
    for(var i=0; i<docs.length; ){      
      temp = [];
      for (var j=0; j<6&&i<docs.length; j++,i++) {
      	temp.push({url: "/img/brand/"+docs[i]._id.toString()+".jpg",
      			   brand: docs[i].name});
      }
      brand.push(temp);
    }
    return callback({ret: 1, logolist: brand});
  });

}

//根据品牌获取产品列表
exports.products = function(req,callback){
  var data = req.body;
  var numPerPage = parseInt(data.numPerPage);
  var pageNum = parseInt(data.pageNum);
  var query = {
  	brand : data.brand
  };
  if(data['E-SPF']==='10'){
  	query['E-SPF'] = '10';
  }else if(data['E-SPF']==='15'){
  	query['E-SPF'] = '15';
  }else if(data['E-SPF']==='25'){
  	query['E-SPF'] = '25';
  }
  query.lan = req.params.lan;
  db_product.find(query).limit(numPerPage).skip(numPerPage*(pageNum-1),function(err, docs){
    if (err) {
      return callback({ret: 2});           // RETURN: 查询错误
    }
    var prods = [];
    for(var doc=0; doc<docs.length; doc++){
      var prod = {};
      prod.name = docs[doc].name;
      prod._id  = docs[doc]._id;
    	if(docs[doc].sale==='yes'){
    		prod.sale = true;
    	}else{
    		prod.sale = false;
    	}
    	prod.url = "/img/product/picture0" + docs[doc]._id.toString() + ".jpg";
      prods.push(prod);
	  }
    return callback({ret: 1, val: prods});
  });
};

//获取产品详情
exports.productdetail = function(req,callback){
  var query = {};
  query._id = new ObjectID(req.params.id);
  db_product.findOne(query,function(err, doc){
    if (err) {
      return callback({ret: 2});           // RETURN: 查询错误
    }
    var pic = new Array();
    var con = new Array();
    
    var image = doc.image;
    for(var i=0; i<image.length;i++){
    	var ima = {};
    	ima.des = image[i].des;
    	ima.url = "/img/product/" + image[i].url + doc._id.toString() + ".jpg";
    	pic.push(ima);
    }
    con = doc.contents;
    delete doc.contents;
    delete doc.image;
    delete doc.stores;
    delete doc.discount;
    return callback({
    				ret: 1, 
            products: doc,
            image : pic,
            contents: con
    				});
  });
};

// 根据经纬度获得两点间的距离
function getDistance(lngA, latA, lngB, latB) {
  var lat1 = Math.PI/180*latA;
  var lat2 = Math.PI/180*latB;
  var lon1 = Math.PI/180*lngA;
  var lon2 = Math.PI/180*lngB;
  var Pi  = Math.PI;
  var R   = 6371.004;//地球半径
  var sin = Math.sin;
  var cos = Math.cos;
  var Distance =  Math.acos(Math.sin(lat1)*Math.sin(lat2)+Math.cos(lat1)*Math.cos(lat2)*Math.cos(lon2-lon1))*R;
  return Distance;
}

// 根据商品id获取店铺（分页）
exports.prodstores = function(req, callback) {
  var near_store   = true;
  var query   = req.params;
  query.skip  = parseInt(query.skip);
  query.limit = parseInt(query.limit);
  query.lng   = parseFloat(query.lng);
  query.lat   = parseFloat(query.lat);
  if (query.lng===0&&query.lat===0&&query.prov==="null"&&query.muni==="null"&&query.area==="null") {
    query.prov = "北京";
    query.muni = "北京";
    near_store = false;
  }
  if (query.prov.indexOf("省")!==-1 || query.prov.indexOf("市")!==-1) {
    query.prov = query.prov.slice(0, query.prov.length-1);
  }
  if (query.muni.indexOf("市")!==-1) {
    query.muni = query.muni.slice(0, query.muni.length-1);
  }
  if (query.area.indexOf("区")!==-1 || query.area.indexOf("县")!==-1) {
    query.area = query.area.slice(0, query.area.length-1);
  }
  if (query.prov !== "null") {
    eval("query.prov = /"+query.prov+"/");
  } else {
    query.prov = /./;
  }
  if (query.muni !== "null") {
    eval("query.muni = /"+query.muni+"/");
  } else {
    query.muni = /./;
  }
  if (query.area !== "null") {
    eval("query.area = /"+query.area+"/");
  } else {
    query.area = /./;
  }
  if (query.cont !== "null") {
    eval("query.cont = /"+query.cont+"/");
  } else {
    query.cont = /./;
  }
  db_product.findOne({_id: new ObjectID(query.prodid)}, function(err, doc){
    if (err || !doc) {
      callback({ret: 2});
    }
    if (!doc.stores || doc.stores.length === 0) {
      callback({ret: 1, val: {stores: [], near: false}});
    }
    var storeIds = [];
    if (!doc.stores) {
      doc.stores = [];
    }
    for (var i=0; i<doc.stores.length; i++) {
      storeIds.push(new ObjectID(doc.stores[i]));
    }
    db_store.find({_id: {"$in": storeIds}, gps: {"$near": [query.lng, query.lat]}, province: query.prov, municipality: query.muni, area: query.area, $or:[{address: query.cont}, {name: query.cont}]}).skip((query.skip-1)*query.limit).limit(query.limit, function(err, docs){
      if (err) {
        return callback({ret: 2});
      }
      var discountMap = {};
      for (var i=0; i<doc.stores.length; i++) {
        discountMap[doc.stores[i]] = doc.discount[i];
      }
      for (var i=0; i<docs.length; i++) {
        docs[i].discount  = discountMap[docs[i]._id.toString()];
        docs[i].distance  = getDistance(query.lng, query.lat, docs[i].gps[0], docs[i].gps[1]);
      }
      if (docs.length === 0) {
        near_store = false;
      }
      return callback({ret: 1, val: {stores: docs, near: near_store}});
    });
  });
};

//#############产生随机数#############
//获取随机数
exports.random = function(callback){
  return callback({ret: 1, num:0.5});
}
// 获取tips
exports.gettips = function(req, callback){
  var query = {
    lan : req.params.lan,
    espf: req.body.espf,
    weather : req.body.weather
  }
  console.log(query);
  db_tips.find(query, function(err,docs){
    if (err) {
      callback({ret: 2});                           // RETURN: 数据库出错
    }
    var tips = new Array();
    for(var i=0;i<docs.length;i++){
      tips.push(docs[i].detail);
    }
    callback({ret: 1, val: tips});                  // RETURN: 返回成功
  });
};
// 统计分享次数
exports.sharelink = function(req, callback) {
  var userid = req.params.userid;
  var lan    = req.params.lan;
  db_user.update({_id: new ObjectID(userid)}, {$inc: {sharenum: 1}}, function(err){
    return callback({ret: 1});                                       // 操作完成
  });
};
