"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _fs = _interopRequireDefault(require("fs"));
var _path = _interopRequireDefault(require("path"));
var _bytes = _interopRequireDefault(require("bytes"));
var _mimeTypes = _interopRequireDefault(require("mime-types"));
var _configs = require("../../configs");
var _sharp = _interopRequireDefault(require("sharp"));
class FileUpload {
  static UPLOAD_FOLDER = 'uploads';
  constructor({
    originalname,
    mimetype,
    buffer
  }) {
    this.originalname = originalname;
    this.mimetype = mimetype;
    this.buffer = buffer;
    const originalNames = typeof originalname === 'string' ? originalname.split('.') : [];
    const ext = originalNames.length > 1 ? originalNames.pop() : _mimeTypes.default.extension(this.mimetype);
    this.filename = `${_configs.UUID_TRANSLATOR.generate()}.${ext}`;
  }
  toJSON() {
    const {
      buffer,
      ...rest
    } = this;
    rest.filesize = (0, _bytes.default)(Buffer.byteLength(buffer));
    return rest;
  }
  toString() {
    return this.filepath || this.originalname;
  }
  isImage() {
    return /^image\/(.*)\/?$/i.test(this.mimetype);
  }
  async save(...paths) {
    if (!this.filepath) {
      const uploadDir = _path.default.join(_configs.PUBLIC_DIR, FileUpload.UPLOAD_FOLDER, ...paths);
      _fs.default.mkdirSync(uploadDir, {
        recursive: true
      });
      if (this.isImage()) {
        let image = (0, _sharp.default)(this.buffer).webp({
          quality: 50
        });
        const {
          width
        } = await image.metadata();
        if (width > 1980) {
          image = image.resize(1980);
        }
        const filename = `${this.filename.split('.')[0]}.webp`;
        await image.toFile(_path.default.join(uploadDir, filename));
        this.filepath = _path.default.posix.join(FileUpload.UPLOAD_FOLDER, ...paths, filename);
      } else {
        _fs.default.writeFileSync(_path.default.join(uploadDir, this.filename), this.buffer);
        this.filepath = _path.default.posix.join(FileUpload.UPLOAD_FOLDER, ...paths, this.filename);
      }
      return this.filepath;
    } else {
      throw new Error('File saved. Use the "filepath" attribute to retrieve the file path.');
    }
  }
  static remove(filepath) {
    filepath = _path.default.join(_configs.PUBLIC_DIR, filepath);
    if (!_fs.default.existsSync(filepath)) return;
    const stats = _fs.default.statSync(filepath);
    if (stats.isFile()) _fs.default.unlinkSync(filepath);
  }
}
var _default = exports.default = FileUpload;