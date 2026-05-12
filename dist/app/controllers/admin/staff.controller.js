"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateStaff = exports.getStaffs = exports.deleteStaff = exports.createStaff = void 0;
var _models = require("../../../models");
const getStaffs = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = ''
    } = req.query;
    const query = {
      deleted: false,
      $or: [{
        name: {
          $regex: search,
          $options: 'i'
        }
      }, {
        mail: {
          $regex: search,
          $options: 'i'
        }
      }, {
        phone: {
          $regex: search,
          $options: 'i'
        }
      }]
    };
    const staffs = await _models.Staff.find(query).limit(limit * 1).skip((page - 1) * limit).sort({
      createdAt: -1
    });
    const count = await _models.Staff.countDocuments(query);
    return res.json({
      success: true,
      data: {
        result: staffs,
        total: count
      }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message || 'Lỗi server'
    });
  }
};
exports.getStaffs = getStaffs;
const createStaff = async (req, res) => {
  try {
    const {
      name,
      mail,
      phone,
      password,
      gender,
      dob,
      address
    } = req.body;
    const existing = await _models.Staff.findOne({
      $or: [{
        mail: mail.toLowerCase()
      }, {
        phone
      }],
      deleted: false
    });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Email hoặc số điện thoại đã tồn tại trên hệ thống.'
      });
    }
    const newStaff = await _models.Staff.create({
      name,
      mail: mail.toLowerCase(),
      phone,
      password,
      gender,
      dob,
      address,
      status: 'active'
    });
    return res.status(201).json({
      success: true,
      message: 'Tạo tài khoản cán bộ thành công',
      data: newStaff
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message || 'Lỗi server'
    });
  }
};
exports.createStaff = createStaff;
const updateStaff = async (req, res) => {
  try {
    const {
      id
    } = req.params;
    const {
      name,
      mail,
      phone,
      password,
      gender,
      dob,
      address,
      status
    } = req.body;
    const staff = await _models.Staff.findOne({
      _id: id,
      deleted: false
    });
    if (!staff) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy tài khoản cán bộ.'
      });
    }
    if (typeof name !== 'undefined') staff.name = name;
    if (typeof mail !== 'undefined') staff.mail = mail.toLowerCase();
    if (typeof phone !== 'undefined') staff.phone = phone;
    if (password) staff.password = password;
    if (typeof gender !== 'undefined') staff.gender = gender;
    if (typeof dob !== 'undefined') staff.dob = dob;
    if (typeof address !== 'undefined') staff.address = address;
    if (typeof status !== 'undefined') staff.status = status;
    await staff.save();
    return res.json({
      success: true,
      message: 'Cập nhật tài khoản cán bộ thành công',
      data: staff
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message || 'Lỗi server'
    });
  }
};
exports.updateStaff = updateStaff;
const deleteStaff = async (req, res) => {
  try {
    const {
      id
    } = req.params;
    const staff = await _models.Staff.findOne({
      _id: id,
      deleted: false
    });
    if (!staff) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy tài khoản cán bộ.'
      });
    }
    if (staff.is_protected) {
      return res.status(403).json({
        success: false,
        message: 'Không thể xóa tài khoản hệ thống này.'
      });
    }
    staff.deleted = true;
    await staff.save();
    return res.json({
      success: true,
      message: 'Xóa tài khoản cán bộ thành công'
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message || 'Lỗi server'
    });
  }
};
exports.deleteStaff = deleteStaff;