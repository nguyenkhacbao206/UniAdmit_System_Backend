"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getUserProfile = getUserProfile;
exports.updateAvatar = updateAvatar;
exports.updateCV = updateCV;
exports.updateDocument = updateDocument;
exports.updateUserProfile = updateUserProfile;
var _models = require("../../models");
var _helpers = require("../../utils/helpers");
var _lodash = _interopRequireDefault(require("lodash"));
async function updateUserProfile(userId, profileData) {
  const user = await _models.User.findById(userId);
  if (!user) {
    (0, _helpers.abort)(404, 'Không tìm thấy người dùng');
  }
  const userFields = ['name', 'phone', 'email', 'avatar', 'gender', 'dob', 'address'];
  const userData = _lodash.default.omitBy(_lodash.default.pick(profileData, userFields), v => _lodash.default.isNil(v) || v === '');
  if (userData.email && userData.email !== user.email) {
    const existEmail = await _models.User.findOne({
      email: userData.email,
      _id: {
        $ne: userId
      },
      deleted: false
    });
    if (existEmail) (0, _helpers.abort)(400, 'Email này đã được sử dụng.');
  }
  if (userData.phone && userData.phone !== user.phone) {
    const existPhone = await _models.User.findOne({
      phone: userData.phone,
      _id: {
        $ne: userId
      },
      deleted: false
    });
    if (existPhone) (0, _helpers.abort)(400, 'Số điện thoại này đã được sử dụng.');
  }
  Object.assign(user, userData);
  await user.save();
  const profileFields = ['ethnicity', 'gender', 'dob', 'permanentAddress', 'contactAddress', 'cccd', 'place_of_issue', 'avatar', 'cv', 'school', 'score', 'rank', 'cccd_doc', 'transcript_doc'];
  const detailData = _lodash.default.omitBy(_lodash.default.pick(profileData, profileFields), _lodash.default.isNil);
  let profile = await _models.Profile.findOne({
    user_id: userId
  });
  if (!profile) {
    profile = new _models.Profile({
      user_id: userId,
      name: user.name
    });
  }
  Object.assign(profile, detailData);
  profile.name = user.name;
  profile.email = user.email;
  profile.phone = user.phone;
  profile.avatar = user.avatar;
  profile.gender = user.gender;
  profile.dob = user.dob;
  await profile.save();
  return {
    ...user.toJSON(),
    profile: profile.toJSON()
  };
}
async function getUserProfile(userId) {
  const user = await _models.User.findOne({
    _id: userId,
    deleted: false
  });
  if (!user) {
    (0, _helpers.abort)(404, 'Không tìm thấy người dùng');
  }
  let profile = await _models.Profile.findOne({
    user_id: userId
  });
  if (!profile) {
    profile = await _models.Profile.create({
      user_id: userId,
      name: user.name,
      email: user.email,
      phone: user.phone
    });
  }
  return {
    ...user.toJSON(),
    profile: profile.toJSON()
  };
}
async function updateAvatar(userId, avatarPath) {
  const user = await _models.User.findById(userId);
  if (!user) (0, _helpers.abort)(404, 'User không tồn tại');
  user.avatar = avatarPath;
  await user.save();
  await _models.Profile.findOneAndUpdate({
    user_id: userId
  }, {
    avatar: avatarPath
  }, {
    upsert: true,
    new: true
  });
  return user.avatar;
}
async function updateCV(userId, cvPath) {
  const profile = await _models.Profile.findOneAndUpdate({
    user_id: userId
  }, {
    cv: cvPath
  }, {
    new: true,
    upsert: true
  });
  return profile.cv;
}
async function updateDocument(userId, field, path) {
  const profile = await _models.Profile.findOneAndUpdate({
    user_id: userId
  }, {
    [field]: path
  }, {
    new: true,
    upsert: true
  });
  return profile[field];
}