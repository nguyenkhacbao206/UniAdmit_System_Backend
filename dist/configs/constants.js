"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VIEW_DIR = exports.VALIDATE_PHONE_REGEX = exports.VALIDATE_PASSWORD_REGEX = exports.VALIDATE_FULL_NAME_REGEX = exports.VALIDATE_EMAIL_REGEX = exports.UUID_TRANSLATOR = exports.TOKEN_TYPE = exports.STATUS_DEFAULT_MESSAGE = exports.SOURCE_DIR = exports.SECRET_KEY = exports.REQUESTS_LIMIT_PER_MINUTE = exports.REFRESH_TOKEN_EXPIRE_IN = exports.PUBLIC_DIR = exports.PRIVATE_DIR = exports.OTHER_URLS_CLIENT = exports.NODE_ENV = exports.MAX_STRING_SIZE = exports.MAIL_USERNAME = exports.MAIL_SECURE = exports.MAIL_PORT = exports.MAIL_PASSWORD = exports.MAIL_HOST = exports.MAIL_FROM_NAME = exports.MAIL_FROM_ADDRESS = exports.LOG_DIR = exports.LINK_STATIC_URL = exports.LINK_RESET_PASSWORD_URL = exports.JOI_DEFAULT_OPTIONS = exports.GOOGLE_CLIENT_SECRET = exports.GOOGLE_CLIENT_ID = exports.GOOGLE_CALLBACK_URL = exports.DB_USERNAME = exports.DB_PASSWORD = exports.DB_NAME = exports.DB_AUTH_SOURCE = exports.DATABASE_URI = exports.CACHE_DIR = exports.BACKUP_DIR = exports.APP_URL_CLIENT = exports.APP_URL_API = exports.APP_NAME = exports.APP_ENV = exports.APP_DIR = exports.APP_DEBUG = exports.ACCESS_TOKEN_EXPIRE_IN = void 0;
var _path = _interopRequireDefault(require("path"));
var _shortUuid = _interopRequireDefault(require("short-uuid"));
var _dotenv = _interopRequireDefault(require("dotenv"));
var _assert = _interopRequireDefault(require("assert"));
var _lodash = _interopRequireDefault(require("lodash"));
const assertMsg = key => `Missing ${key}. Please configure it before running the application.`;
const SOURCE_DIR = exports.SOURCE_DIR = _path.default.dirname(__dirname);
const APP_DIR = exports.APP_DIR = _path.default.dirname(SOURCE_DIR);
const PUBLIC_DIR = exports.PUBLIC_DIR = _path.default.join(APP_DIR, 'public');
const PRIVATE_DIR = exports.PRIVATE_DIR = _path.default.join(APP_DIR, 'private');
const LOG_DIR = exports.LOG_DIR = _path.default.join(PRIVATE_DIR, 'logs');
const CACHE_DIR = exports.CACHE_DIR = _path.default.join(PRIVATE_DIR, 'cache');
const BACKUP_DIR = exports.BACKUP_DIR = _path.default.join(PRIVATE_DIR, 'backup');
const VIEW_DIR = exports.VIEW_DIR = _path.default.join(SOURCE_DIR, 'views');
const APP_ENV = exports.APP_ENV = {
  PRODUCTION: 'production',
  DEVELOPMENT: 'development'
};
const NODE_ENV = exports.NODE_ENV = Object.values(APP_ENV).includes(process.env.NODE_ENV) ? process.env.NODE_ENV : APP_ENV.PRODUCTION;
_dotenv.default.config({
  path: [_path.default.join(APP_DIR, `.env.${NODE_ENV}`), _path.default.join(APP_DIR, '.env')]
});
const APP_DEBUG = exports.APP_DEBUG = NODE_ENV === APP_ENV.DEVELOPMENT;
const APP_NAME = exports.APP_NAME = process.env.APP_NAME;
(0, _assert.default)(!_lodash.default.isEmpty(APP_NAME), assertMsg('APP_NAME'));
const APP_URL_API = exports.APP_URL_API = process.env.APP_URL_API;
(0, _assert.default)(!_lodash.default.isEmpty(APP_URL_API), assertMsg('APP_URL_API'));
const APP_URL_CLIENT = exports.APP_URL_CLIENT = process.env.APP_URL_CLIENT;
(0, _assert.default)(!_lodash.default.isEmpty(APP_URL_CLIENT), assertMsg('APP_URL_CLIENT'));
const OTHER_URLS_CLIENT = exports.OTHER_URLS_CLIENT = process.env.OTHER_URLS_CLIENT ? JSON.parse(process.env.OTHER_URLS_CLIENT) : [];
(0, _assert.default)(_lodash.default.isArray(OTHER_URLS_CLIENT), 'OTHER_URLS_CLIENT must be an array.');
const SECRET_KEY = exports.SECRET_KEY = process.env.SECRET_KEY;
(0, _assert.default)(!_lodash.default.isEmpty(SECRET_KEY), assertMsg('SECRET_KEY'));
const ACCESS_TOKEN_EXPIRE_IN = exports.ACCESS_TOKEN_EXPIRE_IN = process.env.ACCESS_TOKEN_EXPIRE_IN || '15m';
const REFRESH_TOKEN_EXPIRE_IN = exports.REFRESH_TOKEN_EXPIRE_IN = process.env.REFRESH_TOKEN_EXPIRE_IN || '30d';
const REQUESTS_LIMIT_PER_MINUTE = exports.REQUESTS_LIMIT_PER_MINUTE = parseInt(process.env.REQUESTS_LIMIT_PER_MINUTE, 10) || 1000;
const LINK_STATIC_URL = exports.LINK_STATIC_URL = `${APP_URL_API}/static/`;
const LINK_RESET_PASSWORD_URL = exports.LINK_RESET_PASSWORD_URL = `${APP_URL_CLIENT}/reset-password`;
(0, _assert.default)(!_lodash.default.isEmpty(process.env.DB_HOST), assertMsg('DB_HOST'));
(0, _assert.default)(!_lodash.default.isEmpty(process.env.DB_NAME), assertMsg('DB_NAME'));
(0, _assert.default)(!_lodash.default.isEmpty(process.env.DB_AUTH_SOURCE), assertMsg('DB_AUTH_SOURCE'));
const DATABASE_URI = exports.DATABASE_URI = 'mongodb' + (process.env.DB_PORT ? '' : '+srv') + '://' + process.env.DB_HOST + (process.env.DB_PORT ? ':' + process.env.DB_PORT : '');
const DB_NAME = exports.DB_NAME = process.env.DB_NAME;
const DB_USERNAME = exports.DB_USERNAME = process.env.DB_USERNAME;
const DB_PASSWORD = exports.DB_PASSWORD = process.env.DB_PASSWORD;
const DB_AUTH_SOURCE = exports.DB_AUTH_SOURCE = process.env.DB_AUTH_SOURCE;
const MAIL_HOST = exports.MAIL_HOST = process.env.MAIL_HOST;
const MAIL_PORT = exports.MAIL_PORT = process.env.MAIL_PORT;
const MAIL_SECURE = exports.MAIL_SECURE = Number(MAIL_PORT) === 465;
const MAIL_USERNAME = exports.MAIL_USERNAME = process.env.MAIL_USERNAME;
const MAIL_PASSWORD = exports.MAIL_PASSWORD = (process.env.MAIL_PASSWORD || '').replace(/\s+/g, '');
const MAIL_FROM_ADDRESS = exports.MAIL_FROM_ADDRESS = process.env.MAIL_FROM_ADDRESS || MAIL_USERNAME;
const MAIL_FROM_NAME = exports.MAIL_FROM_NAME = process.env.MAIL_FROM_NAME || APP_NAME;
(0, _assert.default)(!_lodash.default.isEmpty(MAIL_HOST), assertMsg('MAIL_HOST'));
(0, _assert.default)(!_lodash.default.isEmpty(MAIL_PORT), assertMsg('MAIL_PORT'));
(0, _assert.default)(!_lodash.default.isEmpty(MAIL_USERNAME), assertMsg('MAIL_USERNAME'));
(0, _assert.default)(!_lodash.default.isEmpty(MAIL_PASSWORD), assertMsg('MAIL_PASSWORD'));
const GOOGLE_CLIENT_ID = exports.GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = exports.GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_CALLBACK_URL = exports.GOOGLE_CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL;
(0, _assert.default)(!_lodash.default.isEmpty(GOOGLE_CLIENT_ID), assertMsg('GOOGLE_CLIENT_ID'));
(0, _assert.default)(!_lodash.default.isEmpty(GOOGLE_CLIENT_SECRET), assertMsg('GOOGLE_CLIENT_SECRET'));
(0, _assert.default)(!_lodash.default.isEmpty(GOOGLE_CALLBACK_URL), assertMsg('GOOGLE_CALLBACK_URL'));
const TOKEN_TYPE = exports.TOKEN_TYPE = {
  USER_AUTHORIZATION: 'USER_AUTHORIZATION',
  USER_REFRESH_TOKEN: 'USER_REFRESH_TOKEN',
  ADMIN_AUTHORIZATION: 'ADMIN_AUTHORIZATION',
  ADMIN_REFRESH_TOKEN: 'ADMIN_REFRESH_TOKEN',
  STAFF_AUTHORIZATION: 'STAFF_AUTHORIZATION',
  STAFF_REFRESH_TOKEN: 'STAFF_REFRESH_TOKEN'
};
const MAX_STRING_SIZE = exports.MAX_STRING_SIZE = 255;
const UUID_TRANSLATOR = exports.UUID_TRANSLATOR = (0, _shortUuid.default)();
const STATUS_DEFAULT_MESSAGE = exports.STATUS_DEFAULT_MESSAGE = {
  401: 'Vui lòng đăng nhập để tiếp tục.',
  403: 'Xin lỗi, bạn không được phép truy cập.',
  404: 'Đường dẫn không tồn tại.',
  429: 'Có quá nhiều yêu cầu. Vui lòng thử lại sau.',
  500: 'Đã xảy ra lỗi. Vui lòng thử lại sau.'
};
const JOI_DEFAULT_OPTIONS = exports.JOI_DEFAULT_OPTIONS = {
  abortEarly: false,
  errors: {
    wrap: {
      label: false
    },
    language: {
      'any.exists': 'any.exists'
    }
  },
  externals: false,
  stripUnknown: true,
  messages: {
    'boolean.base': '{{#label}} sai định dạng.',
    'string.base': '{{#label}} sai định dạng.',
    'string.empty': '{{#label}} không được bỏ trống.',
    'string.min': '{{#label}} không được ít hơn {{#limit}} ký tự.',
    'string.max': '{{#label}} không được vượt quá {{#limit}} ký tự.',
    'string.pattern.base': '{{#label}} không đúng định dạng.',
    'string.email': '{{#label}} không đúng định dạng.',
    'number.base': '{{#label}} sai định dạng.',
    'number.integer': '{{#label}} sai định dạng.',
    'number.min': '{{#label}} không được nhỏ hơn {{#limit}}.',
    'number.max': '{{#label}} không được lớn hơn {{#limit}}.',
    'number.greater': '{{#label}} phải lớn hơn {{#limit}}',
    'number.less': '{{#label}} phải nhỏ hơn {{#limit}}',
    'array.base': '{{#label}} sai định dạng.',
    'array.unique': 'Các {{#label}} không được giống nhau.',
    'array.min': '{{#label}} không được ít hơn {{#limit}} phần tử.',
    'array.max': '{{#label}} không được vượt quá {{#limit}} phần tử.',
    'array.length': '{{#label}} phải có đúng {{#limit}} phần tử.',
    'array.includesRequiredUnknowns': '{{#label}} không hợp lệ.',
    'array.includesRequiredKnowns': '{{#label}} không hợp lệ.',
    'object.base': '{{#label}} sai định dạng.',
    'object.unknown': 'Trường {#key} không được xác định.',
    'object.instance': '{{#label}} không đúng định dạng.',
    'binary.base': '{{#label}} sai định dạng.',
    'binary.min': '{{#label}} không được ít hơn {{#limit}} bytes.',
    'binary.max': '{{#label}} không được vượt quá {{#limit}} bytes.',
    'any.only': '{{#label}} không hợp lệ.',
    'any.required': '{{#label}} không được bỏ trống.',
    'any.unknown': 'Trường {#key} không được xác định.',
    'any.invalid': '{{#label}} không hợp lệ.',
    'any.exists': '{{#label}} đã tồn tại.'
  }
};
const VALIDATE_PHONE_REGEX = exports.VALIDATE_PHONE_REGEX = /^(0[235789])[0-9]{8}$/;
const VALIDATE_EMAIL_REGEX = exports.VALIDATE_EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const VALIDATE_PASSWORD_REGEX = exports.VALIDATE_PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_])/;
const VALIDATE_FULL_NAME_REGEX = exports.VALIDATE_FULL_NAME_REGEX = /^[a-zA-ZÀ-ỹ ]+$/;