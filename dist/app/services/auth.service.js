"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.authToken = authToken;
exports.authTokenStaff = authTokenStaff;
exports.authTokenUser = authTokenUser;
exports.blockToken = blockToken;
exports.checkValidLoginAdmin = checkValidLoginAdmin;
exports.checkValidLoginUser = checkValidLoginUser;
exports.findOrCreateUserByGoogle = findOrCreateUserByGoogle;
exports.profileAdmin = profileAdmin;
exports.refreshAdminToken = refreshAdminToken;
exports.refreshUserToken = refreshUserToken;
exports.registerUser = registerUser;
exports.resendOTP = resendOTP;
exports.resetPassword = resetPassword;
exports.tokenBlocklist = void 0;
exports.universalLogin = universalLogin;
exports.updateOTP = updateOTP;
exports.verifyOTP = verifyOTP;
var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));
var _configs = require("../../configs");
var _helpers = require("../../utils/helpers");
var _models = require("../../models");
var _moment = _interopRequireDefault(require("moment"));
const tokenBlocklist = exports.tokenBlocklist = _configs.cache.create('token-block-list');
async function checkValidLoginAdmin({
  phone,
  password
}) {
  const user = await _models.Admin.findOne({
    phone,
    deleted: false
  });
  if (user) {
    const verified = user.verifyPassword(password);
    if (verified) {
      if (user.status === _models.STATUS_ACCOUNT.INACTIVE) {
        (0, _helpers.abort)(400, 'Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản lý.');
      }
      return user;
    }
  }
  return false;
}
function authToken(admin, roleCodes = []) {
  const accessToken = (0, _helpers.generateToken)({
    adminId: admin._id,
    roles: roleCodes
  }, _configs.TOKEN_TYPE.ADMIN_AUTHORIZATION, _configs.ACCESS_TOKEN_EXPIRE_IN);
  const refreshToken = (0, _helpers.generateToken)({
    adminId: admin._id
  }, _configs.TOKEN_TYPE.ADMIN_REFRESH_TOKEN, _configs.REFRESH_TOKEN_EXPIRE_IN);
  const decode = _jsonwebtoken.default.decode(accessToken);
  const expireIn = decode.exp - decode.iat;
  return {
    access_token: accessToken,
    refresh_token: refreshToken,
    expire_in: expireIn,
    auth_type: 'Bearer Token'
  };
}
function authTokenStaff(staff) {
  const accessToken = (0, _helpers.generateToken)({
    staffId: staff._id
  }, _configs.TOKEN_TYPE.STAFF_AUTHORIZATION, _configs.ACCESS_TOKEN_EXPIRE_IN);
  const refreshToken = (0, _helpers.generateToken)({
    staffId: staff._id
  }, _configs.TOKEN_TYPE.STAFF_REFRESH_TOKEN, _configs.REFRESH_TOKEN_EXPIRE_IN);
  const decode = _jsonwebtoken.default.decode(accessToken);
  const expireIn = decode.exp - decode.iat;
  return {
    access_token: accessToken,
    refresh_token: refreshToken,
    expire_in: expireIn,
    auth_type: 'Bearer Token'
  };
}
async function profileAdmin(currentAdmin) {
  const acc = await _models.Admin.findById(currentAdmin._id).select('-password').populate({
    path: 'roles'
  }).lean();
  const permissionIds = [...acc.roles].map(role => role.permission_ids).flat();
  const permissions = await _models.Permission.find({
    _id: {
      $in: permissionIds
    }
  });
  acc.permissions = permissions.map(({
    code
  }) => code);
  delete acc.role_ids;
  delete acc.roles;
  return acc;
}
async function checkValidLoginUser({
  email,
  password
}) {
  const user = await _models.User.findOne({
    email,
    deleted: false
  });
  if (user) {
    const verified = user.verifyPassword(password);
    if (verified) {
      if (user.status === _models.STATUS_ACCOUNT.UNVERIFIED) {
        (0, _helpers.abort)(400, 'Tài khoản chưa được xác thực. Vui lòng kiểm tra email.');
      }
      if (user.status === _models.STATUS_ACCOUNT.INACTIVE) {
        (0, _helpers.abort)(400, 'Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản lý.');
      }
      return user;
    }
  }
  return false;
}
async function universalLogin({
  identifier,
  username,
  password
}) {
  const loginIdentifier = identifier || username;
  if (!loginIdentifier) (0, _helpers.abort)(400, 'Vui lòng cung cấp email hoặc số điện thoại.');
  const admin = await _models.Admin.findOne({
    $or: [{
      email: loginIdentifier.toLowerCase()
    }, {
      phone: loginIdentifier
    }],
    deleted: false
  }).populate('roles');
  if (admin) {
    if (!admin.verifyPassword(password)) (0, _helpers.abort)(400, 'Tài khoản hoặc mật khẩu không đúng.');
    if (admin.status === _models.STATUS_ACCOUNT.INACTIVE) (0, _helpers.abort)(400, 'Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản lý.');
    const roleCodes = admin.roles ? admin.roles.map(r => r.code) : [];
    if (roleCodes.length === 0) (0, _helpers.abort)(403, 'Tài khoản chưa được phân quyền truy cập.');
    const tokenData = authToken(admin, roleCodes);
    return {
      user: admin,
      tokenData,
      roles: roleCodes,
      account_type: 'admin'
    };
  }
  const staff = await _models.Staff.findOne({
    $or: [{
      mail: loginIdentifier.toLowerCase()
    }, {
      phone: loginIdentifier
    }],
    deleted: false
  });
  if (staff) {
    if (!staff.verifyPassword(password)) (0, _helpers.abort)(400, 'Tài khoản hoặc mật khẩu không đúng.');
    if (staff.status === 'inactive') (0, _helpers.abort)(400, 'Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản lý.');
    const tokenData = authTokenStaff(staff);
    return {
      user: staff,
      tokenData,
      roles: ['staff'],
      account_type: 'staff'
    };
  }
  const user = await _models.User.findOne({
    $or: [{
      email: loginIdentifier.toLowerCase()
    }, {
      phone: loginIdentifier
    }],
    deleted: false
  });
  if (user) {
    if (!user.verifyPassword(password)) (0, _helpers.abort)(400, 'Tài khoản hoặc mật khẩu không đúng.');
    if (user.status === _models.STATUS_ACCOUNT.UNVERIFIED) (0, _helpers.abort)(400, 'Tài khoản chưa được xác thực. Vui lòng kiểm tra email.');
    if (user.status === _models.STATUS_ACCOUNT.INACTIVE) (0, _helpers.abort)(400, 'Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản lý.');
    await updateOTP(user);
    return {
      user,
      roles: ['user'],
      account_type: 'user',
      requires_otp: true
    };
  }
  (0, _helpers.abort)(400, 'Tài khoản hoặc mật khẩu không đúng.');
}
function authTokenUser(user) {
  const accessToken = (0, _helpers.generateToken)({
    userId: user._id
  }, _configs.TOKEN_TYPE.USER_AUTHORIZATION, _configs.ACCESS_TOKEN_EXPIRE_IN);
  const refreshToken = (0, _helpers.generateToken)({
    userId: user._id
  }, _configs.TOKEN_TYPE.USER_REFRESH_TOKEN, _configs.REFRESH_TOKEN_EXPIRE_IN);
  const decode = _jsonwebtoken.default.decode(accessToken);
  const expireIn = decode.exp - decode.iat;
  return {
    access_token: accessToken,
    refresh_token: refreshToken,
    expire_in: expireIn,
    auth_type: 'Bearer Token'
  };
}
async function refreshUserToken(refreshToken) {
  try {
    const decoded = (0, _helpers.verifyToken)(refreshToken, _configs.TOKEN_TYPE.USER_REFRESH_TOKEN);
    const user = await _models.User.findOne({
      _id: decoded.userId,
      deleted: false
    });
    if (!user || user.status === _models.STATUS_ACCOUNT.INACTIVE) {
      (0, _helpers.abort)(401, 'Token không hợp lệ hoặc tài khoản đã bị khóa.');
    }
    return authTokenUser(user);
  } catch (e) {
    (0, _helpers.abort)(401, 'Refresh token không hợp lệ hoặc đã hết hạn.');
  }
}
async function refreshAdminToken(refreshToken) {
  try {
    const decoded = (0, _helpers.verifyToken)(refreshToken, _configs.TOKEN_TYPE.ADMIN_REFRESH_TOKEN);
    const admin = await _models.Admin.findOne({
      _id: decoded.adminId,
      deleted: false
    }).populate('roles');
    if (!admin || admin.status === _models.STATUS_ACCOUNT.INACTIVE) {
      (0, _helpers.abort)(401, 'Token không hợp lệ hoặc tài khoản đã bị khóa.');
    }
    const roleCodes = admin.roles ? admin.roles.map(r => r.code) : [];
    return authToken(admin, roleCodes);
  } catch (e) {
    (0, _helpers.abort)(401, 'Refresh token không hợp lệ hoặc đã hết hạn.');
  }
}
async function blockToken(token) {
  const decoded = _jsonwebtoken.default.decode(token);
  const expiresIn = decoded.exp;
  const now = (0, _moment.default)().unix();
  await tokenBlocklist.set(token, 1, expiresIn - now);
}
async function updateOTP(user) {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otp_expired_at = (0, _moment.default)().add(10, 'minutes').toDate();
  user.otp = otp;
  user.otp_expired_at = otp_expired_at;
  await user.save();
  return user;
}
async function registerUser(userData) {
  const {
    email,
    phone,
    name,
    password
  } = userData;
  const existingEmail = await _models.User.findOne({
    email,
    deleted: false
  });
  if (existingEmail) {
    (0, _helpers.abort)(400, 'Email đã được sử dụng.');
  }
  const existingPhone = await _models.User.findOne({
    phone,
    deleted: false
  });
  if (existingPhone) {
    (0, _helpers.abort)(400, 'Số điện thoại đã được sử dụng.');
  }
  let user = await _models.User.create({
    name,
    email,
    phone,
    password,
    status: _models.STATUS_ACCOUNT.UNVERIFIED
  });
  user = await updateOTP(user);
  return user;
}
async function resendOTP(email) {
  const user = await _models.User.findOne({
    email,
    deleted: false
  });
  if (!user) {
    (0, _helpers.abort)(400, 'Email không tồn tại.');
  }
  if (user.status === _models.STATUS_ACCOUNT.ACTIVE && (0, _moment.default)().isAfter(user.otp_expired_at)) {}
  return await updateOTP(user);
}
async function verifyOTP({
  email,
  otp
}, checkUnverified = true) {
  const user = await _models.User.findOne({
    email,
    deleted: false
  });
  if (!user) {
    (0, _helpers.abort)(400, 'Email không tồn tại.');
  }
  if (checkUnverified && user.status === _models.STATUS_ACCOUNT.ACTIVE) {
    (0, _helpers.abort)(400, 'Tài khoản đã được xác thực trước đó.');
  }
  if (user.otp !== otp) {
    (0, _helpers.abort)(400, 'Mã xác thực không chính xác.');
  }
  if ((0, _moment.default)().isAfter(user.otp_expired_at)) {
    (0, _helpers.abort)(400, 'Mã xác thực đã hết hạn.');
  }
  if (user.status === _models.STATUS_ACCOUNT.UNVERIFIED) {
    user.status = _models.STATUS_ACCOUNT.ACTIVE;
  }
  user.otp = '';
  user.otp_expired_at = null;
  await user.save();
  return user;
}
async function resetPassword({
  email,
  password
}) {
  const user = await _models.User.findOne({
    email,
    deleted: false
  });
  if (!user) {
    (0, _helpers.abort)(404, 'Người dùng không tồn tại.');
  }
  if (user.status === _models.STATUS_ACCOUNT.INACTIVE) {
    (0, _helpers.abort)(400, 'Tài khoản đã bị khóa.');
  }
  user.password = password;
  await user.save();
  return user;
}
async function findOrCreateUserByGoogle(profile) {
  let user = await _models.User.findOne({
    email: profile.email,
    deleted: false
  });
  if (!user) {
    user = await _models.User.create({
      email: profile.email,
      name: profile.name,
      avatar: profile.picture,
      status: _models.STATUS_ACCOUNT.ACTIVE,
      password: Math.random().toString(36).slice(-10),
      phone: ''
    });
  }
  if (user.status === _models.STATUS_ACCOUNT.INACTIVE) {
    (0, _helpers.abort)(400, 'Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản lý.');
  }
  return user;
}