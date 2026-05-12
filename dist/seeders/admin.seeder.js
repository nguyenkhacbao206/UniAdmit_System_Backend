"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _models = require("../models");
async function adminSeeder(session) {
  const name = 'Super Admin';
  const phone = '0987654321';
  const email = 'admin@gmail.com';
  const password = 'baodepzai123';
  const role = await _models.Role.findOne({
    code: _models.ROLE.SUPER_ADMIN
  }).session(session);
  await _models.Admin.findOneAndUpdate({
    phone,
    email
  }, {
    $set: {
      name,
      phone,
      email,
      password,
      role_ids: [role._id]
    }
  }, {
    upsert: true,
    session
  });
}
var _default = exports.default = adminSeeder;