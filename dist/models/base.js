"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.USER_ROLE = exports.USER_PERMISSION = exports.STATUS_ACCOUNT = exports.ROLE = exports.PERMISSION = exports.ObjectId = exports.EVENT_TYPE = void 0;
exports.default = createModel;
var _mongoose = _interopRequireDefault(require("mongoose"));
function createModel(name, collection, definition, options) {
  const {
    virtuals,
    methods,
    ...restOptions
  } = options ?? {};
  const schema = new _mongoose.default.Schema(definition, {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    },
    versionKey: false,
    id: false,
    toJSON: {
      getters: true,
      virtuals: true
    },
    ...restOptions
  });
  if (virtuals) {
    Object.keys(virtuals).forEach(key => {
      const virtual = virtuals[key];
      if (virtual.ref || virtual.options) {
        schema.virtual(key, virtual.options || virtual);
      } else {
        if (virtual.get) schema.virtual(key).get(virtual.get);
        if (virtual.set) schema.virtual(key).set(virtual.set);
      }
    });
  }
  if (methods) {
    Object.keys(methods).forEach(key => {
      schema.methods[key] = methods[key];
    });
  }
  return _mongoose.default.model(name, schema, collection);
}
const {
  ObjectId
} = _mongoose.default.Types;
exports.ObjectId = ObjectId;
const ROLE = exports.ROLE = {
  SUPER_ADMIN: 'super-admin'
};
const PERMISSION = exports.PERMISSION = {
  SUPER_ADMIN: 'super-admin',
  LIST_ROLE: 'list-role',
  CREATE_ROLE: 'create-role',
  UPDATE_ROLE: 'update-role',
  DELETE_ROLE: 'delete-role',
  UPDATE_PERMISSION_FOR_ROLE: 'update-permission-for-role'
};
const USER_PERMISSION = exports.USER_PERMISSION = {
  REMOVE_MEMBER: 'remove-member',
  ACCEPT_MEMBER: 'accept-member'
};
const USER_ROLE = exports.USER_ROLE = {
  MANAGER: 'club-manager',
  CENSOR: 'club-censor'
};
const STATUS_ACCOUNT = exports.STATUS_ACCOUNT = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  UNVERIFIED: 'UNVERIFIED'
};
const EVENT_TYPE = exports.EVENT_TYPE = {
  INTERNAL: 'INTERNAL',
  PUBLIC: 'PUBLIC'
};