"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateItem = exports.readAccounts = exports.createItem = exports.addAccountsForRole = void 0;
var _models = require("../../../models");
var _classes = require("../../../utils/classes");
var _helpers = require("../../../utils/helpers");
var _joi = _interopRequireDefault(require("joi"));
var _mongoose = require("mongoose");
var roleService = _interopRequireWildcard(require("../../services/role.service"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const createItem = exports.createItem = _joi.default.object({
  name: _joi.default.string().trim().max(50).required().label('Tên vai trò').custom((value, helpers) => new _classes.AsyncValidate(value, async function () {
    const role = await _models.Role.findOne({
      name: value
    });
    return !role ? value : helpers.error('any.exists');
  })),
  parent_id: _joi.default.string().trim().empty(_joi.default.valid('', null)).default(null).label('Vai trò cha').custom(function (value, helpers) {
    if (!(0, _mongoose.isValidObjectId)(value)) {
      return helpers.error('any.invalid');
    }
    return new _classes.AsyncValidate(value, async function () {
      const role = await _models.Role.findOne({
        _id: value
      });
      return role ? value : helpers.error('any.invalid');
    });
  }),
  description: _joi.default.string().trim().max(100).empty(_joi.default.valid('', null)).default('').label('Mô tả')
});
function isNotValidParentId(tree, id, parentId) {
  function findNodeById(nodes, id) {
    for (const node of nodes) {
      if (node._id.equals(id)) return node;
      if (node.children) {
        const result = findNodeById(node.children, id);
        if (result) return result;
      }
    }
    return null;
  }
  function checkDescendant(node, targetId) {
    if (node._id.equals(targetId)) return true;
    if (node.children) {
      for (const child of node.children) {
        if (checkDescendant(child, targetId)) return true;
      }
    }
    return false;
  }
  const startNode = findNodeById(tree, id);
  if (startNode) {
    return checkDescendant(startNode, parentId);
  }
  return false;
}
const updateItem = exports.updateItem = _joi.default.object({
  name: _joi.default.string().trim().max(50).required().label('Tên vai trò').custom((value, helpers) => new _classes.AsyncValidate(value, async function (req) {
    const role = await _models.Role.findOne({
      name: value,
      _id: {
        $ne: req.role._id
      }
    });
    return !role ? value : helpers.error('any.exists');
  })),
  parent_id: _joi.default.string().trim().empty(_joi.default.valid('', null)).default(null).label('Vai trò cha').custom(function (value, helpers) {
    if (!(0, _mongoose.isValidObjectId)(value)) {
      return helpers.error('any.invalid');
    }
    return new _classes.AsyncValidate(value, async function (req) {
      if (req.role._id.equals(value)) {
        return helpers.error('any.invalid');
      }
      const role = await _models.Role.findById(value);
      if (role) {
        const tree = await roleService.treeData();
        if (!isNotValidParentId(tree, req.role._id, role._id)) {
          return value;
        }
      }
      return helpers.error('any.invalid');
    });
  }),
  description: _joi.default.string().trim().max(100).empty(_joi.default.valid('', null)).default('').label('Mô tả')
});
const addAccountsForRole = exports.addAccountsForRole = _joi.default.object({
  account_ids: _joi.default.array().single().items(_joi.default.string().trim().label('Người dùng').custom(function (value, helpers) {
    if (!(0, _mongoose.isValidObjectId)(value)) {
      return helpers.error('any.invalid');
    }
    return new _classes.AsyncValidate(value, async function (req) {
      const account = await _models.Admin.findOne({
        _id: value,
        is_protected: false,
        role_ids: {
          $ne: req.role._id
        }
      });
      return account ? value : helpers.error('any.invalid');
    });
  })).min(1).required().label('Người dùng')
});
const readAccounts = exports.readAccounts = _joi.default.object({
  q: (0, _helpers.tryValidateOrDefault)(_joi.default.string().trim(), ''),
  page: (0, _helpers.tryValidateOrDefault)(_joi.default.number().integer().min(1), 1),
  per_page: (0, _helpers.tryValidateOrDefault)(_joi.default.number().integer().min(1).max(100), 50)
});