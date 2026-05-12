"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _express = _interopRequireDefault(require("express"));
var _path = _interopRequireDefault(require("path"));
var _serveFavicon = _interopRequireDefault(require("serve-favicon"));
var _helmet = _interopRequireDefault(require("helmet"));
var _multer = _interopRequireDefault(require("multer"));
var _cookieParser = _interopRequireDefault(require("cookie-parser"));
var _swaggerUiExpress = _interopRequireDefault(require("swagger-ui-express"));
var _configs = require("./configs");
var _swagger = _interopRequireDefault(require("./configs/swagger.js"));
var _response = require("./handlers/response.handler");
var _cors = _interopRequireDefault(require("./handlers/cors.handler"));
var _httpRequest = _interopRequireDefault(require("./handlers/http-request.handler"));
var _rateLimit = _interopRequireDefault(require("./handlers/rate-limit.handler"));
var _formData = _interopRequireDefault(require("./handlers/form-data.handler"));
var _initLocals = _interopRequireDefault(require("./handlers/init-locals.handler"));
var _notFound = _interopRequireDefault(require("./handlers/not-found.handler"));
var _error = _interopRequireDefault(require("./handlers/error.handler"));
var _routes = _interopRequireDefault(require("./routes"));
function createApp() {
  const app = (0, _express.default)();
  app.response.jsonify = _response.jsonify;
  app.response.sendMail = _response.sendMail;
  app.set('env', _configs.NODE_ENV);
  app.set('trust proxy', 1);
  app.set('views', _configs.VIEW_DIR);
  app.set('view engine', 'ejs');
  app.use(_cors.default);
  if (_configs.APP_DEBUG) {
    app.use(_httpRequest.default);
  }
  app.use((0, _serveFavicon.default)(_path.default.join(_configs.PUBLIC_DIR, 'favicon.ico')));
  app.use('/static', _express.default.static(_configs.PUBLIC_DIR));
  app.use(_rateLimit.default);
  app.use((0, _helmet.default)({
    contentSecurityPolicy: false
  }));
  app.use(_express.default.json());
  app.use(_express.default.urlencoded({
    extended: true
  }));
  app.use((0, _cookieParser.default)());
  app.use((0, _multer.default)({
    storage: _multer.default.memoryStorage()
  }).any());
  app.use(_formData.default);
  app.use(_initLocals.default);
  app.use('/docs', _swaggerUiExpress.default.serve, _swaggerUiExpress.default.setup(_swagger.default));
  (0, _routes.default)(app);
  app.use(_notFound.default);
  app.use(_error.default);
  return app;
}
var _default = exports.default = createApp;