var path = require('path');

/**
 * 应用根目录
 *
 * @property root_dir
 * @type String
 * @final
 */
var root_dir = __dirname;

/**
 * 通用配置
 *
 * @property default_config
 * @type Object
 * @final
 */
var default_config = {
  APP_NAME: 'glass',
  SECRET_KEY: 'My Secret Key',
  DEBUG: false,
  TESTING: false,
  PORT: 3000,
  DB_URI: null,

  MODULES: [ 'account', 'appapi', 'coupon', 'news', 'products', 'userctrl', 'uvindex', 'bguser', 'appversion', 'workerid', 'findglass','tips','store','brand', 'sharelink' ],
  STATIC_ROUTER: '/',
  ROOT_DIR: root_dir,
  MODULE_DIR: path.join(root_dir, 'modules'),
  TEMPLATE_DIR: path.join(root_dir, 'templates'),
  STATIC_DIR: path.join(root_dir, 'static'),
  UPLOAD_DIR: path.join(root_dir, 'static'),
  
  LOG_MAX_SIZE: 204800,
  LOG_BACKUPS: 10,
  LOG_DIR: path.join(root_dir, 'log'),

  SESSION_COOKIE_NAME: null,
  SESSION_COOKIE_DOMAIN: null,
  SESSION_COOKIE_PATH: null,
  SESSION_COOKIE_HTTPONLY: true,
  SESSION_COOKIE_SECURE: false,
  USE_X_SENDFILE: true
};

/**
 * @class Config
 * @constructor
 * @param {Object} extend
 */
function Config(extend) {
  var self = this;
  Object.keys(default_config).forEach(function(k) {
    self[k] = default_config[k];
  });
  Object.keys(extend).forEach(function(k) { self[k] = extend[k]; });
}

/**
 * 开发环境
 *
 * @property development
 * @type Object
 * @final
 */
exports.development = new Config({
  APP_NAME: 'node-skeleton',
  DEBUG: true,
  PORT: 3006,
  DB_URI: 'mongodb://localhost/glass'
});

/**
 * 测试环境
 *
 * @property development
 * @type Object
 * @final
 */
exports.testing = new Config({
  APP_NAME: 'glass',
  DEBUG: true,
  PORT: 3006,
  DB_URI: 'mongodb://localhost/glass'
});

/**
 * 生产环境
 *
 * @property development
 * @type Object
 * @final
 */
exports.production = new Config({
  APP_NAME: 'node-skeleton',
  DEBUG: false,
  PORT: 3006,
  DB_URI: 'mongodb://localhost/glass'
});

exports.dbinfo = {
  dburl: "localhost:27017",
  dbhost: "localhost",
  dbport: "27017",
  dbname: "glass",
  dbpath: "mongodb://localhost:27017/glass?w=1",
  dbmongoose: "mongodb://localhost/glass"
};

exports.appPath = function() {
  return __dirname;
};

exports.pic_size = 1000240; // 限制上传的图片的大小

exports.root_user = {
  username : "admin",
  password : "admin",
  email    : "test@louding.com",
  tel      : "12345678901",
  level    : 0            // root level
};

exports.languages = ["simplified", "traditional", "english"];
