"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _round = _interopRequireDefault(require("../../models/round.js"));
class RoundService {
  async getAll() {
    return await _round.default.find().sort({
      year: -1,
      createdAt: -1
    });
  }
  async getById(id) {
    const round = await _round.default.findById(id);
    if (!round) throw new Error('Không tìm thấy đợt tuyển sinh');
    return round;
  }
  async create(data) {
    const exists = await _round.default.findOne({
      code: data.code
    });
    if (exists) throw new Error('Mã đợt tuyển sinh đã tồn tại');
    return await _round.default.create(data);
  }
  async update(id, data) {
    const round = await _round.default.findById(id);
    if (!round) throw new Error('Không tìm thấy đợt tuyển sinh');
    if (round.status === 'result_published') {
      throw new Error('Đợt tuyển sinh đã công bố kết quả, không thể chỉnh sửa');
    }
    return await _round.default.findByIdAndUpdate(id, data, {
      new: true
    });
  }
  async updateStatus(id, status) {
    const round = await _round.default.findById(id);
    if (!round) throw new Error('Không tìm thấy đợt tuyển sinh');
    const validTransitions = {
      open: ['closed'],
      closed: ['processing'],
      processing: ['closed', 'result_published'],
      result_published: []
    };
    if (!validTransitions[round.status]?.includes(status)) {
      throw new Error(`Không thể chuyển từ trạng thái "${round.status}" sang "${status}"`);
    }
    round.status = status;
    await round.save();
    return round;
  }
  async delete(id) {
    const round = await _round.default.findById(id);
    if (!round) throw new Error('Không tìm thấy đợt tuyển sinh');
    if (round.status !== 'open') {
      throw new Error('Chỉ có thể xóa đợt tuyển sinh ở trạng thái mở');
    }
    return await _round.default.findByIdAndDelete(id);
  }
  async getByPage(query = {}) {
    const {
      page = 1,
      limit = 10,
      search,
      status,
      year
    } = query;
    const filter = {};
    if (search) {
      filter.$or = [{
        name: {
          $regex: search,
          $options: 'i'
        }
      }, {
        code: {
          $regex: search,
          $options: 'i'
        }
      }];
    }
    if (status) filter.status = status;
    if (year) filter.year = Number(year);
    const total = await _round.default.countDocuments(filter);
    const result = await _round.default.find(filter).sort({
      year: -1,
      createdAt: -1
    }).skip((page - 1) * limit).limit(Number(limit));
    return {
      result,
      total
    };
  }
}
var _default = exports.default = new RoundService();