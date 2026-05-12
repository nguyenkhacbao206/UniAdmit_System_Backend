"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateMajorService = exports.getMajorService = exports.getMajorBySearch = exports.getMajorByPages = exports.getMajorByIdService = exports.deleteMajorService = exports.createMajorService = void 0;
var _models = require("../../models");
var _helpers = require("../../utils/helpers");
const createMajorService = async data => {
  const {
    code,
    name,
    major,
    category,
    university_id,
    quota,
    description,
    duration,
    status,
    groups,
    careers,
    curriculum,
    benchmarks,
    employment_rate
  } = data;
  const existingMajor = await _models.Major.findOne({
    code
  });
  if (existingMajor) {
    (0, _helpers.abort)(400, 'Mã ngành đã tồn tại.');
  }
  const existingUniversity = await _models.University.findById(university_id);
  if (!existingUniversity) {
    (0, _helpers.abort)(404, 'Không tìm thấy trường đại học.');
  }
  const majorCount = await _models.Major.countDocuments({
    university_id
  });
  if (majorCount >= existingUniversity.majors) {
    (0, _helpers.abort)(400, `Trường đại học này đã đạt giới hạn số lượng ngành học (${existingUniversity.majors} ngành).`);
  }
  const processArray = arr => {
    if (!arr) return [];
    return arr.flatMap(item => typeof item === 'string' ? item.split(',').map(s => s.trim()) : item).filter(Boolean);
  };
  const newMajor = await _models.Major.create({
    code,
    name,
    major,
    category,
    university_id,
    quota,
    description,
    duration,
    status,
    groups: processArray(groups),
    careers: processArray(careers),
    curriculum: processArray(curriculum),
    benchmarks,
    employment_rate
  });
  const result = await _models.Major.findOne(newMajor._id).populate('university', 'name');
  return result;
};
exports.createMajorService = createMajorService;
const getMajorService = async () => {
  const major = await _models.Major.find().populate('university', 'name code location');
  if (!major) {
    (0, _helpers.abort)(404, 'Không tìm thấy ngành học');
  }
  return major;
};
exports.getMajorService = getMajorService;
const getMajorByIdService = async id => {
  const major = await _models.Major.findById(id).populate('university', 'name code location');
  if (!major) {
    (0, _helpers.abort)(404, 'Không tìm thấy ngành học');
  }
  const calculateDeltas = benchmarks => {
    if (!benchmarks || benchmarks.length === 0) return [];
    const sorted = [...benchmarks].sort((a, b) => b.year - a.year);
    return sorted.map((item, index) => {
      const result = item.toObject ? item.toObject() : {
        ...item
      };
      result.valueDelta = null;
      result.quotaDelta = null;
      const prev = sorted[index + 1];
      if (prev) {
        if (typeof item.value === 'number' && typeof prev.value === 'number') {
          const d = item.value - prev.value;
          result.valueDelta = d >= 0 ? `+${d.toFixed(1)}` : `${d.toFixed(1)}`;
        }
        if (typeof item.quota === 'number' && typeof prev.quota === 'number') {
          const d = item.quota - prev.quota;
          result.quotaDelta = d >= 0 ? `+${d}` : `${d}`;
        }
      }
      return result;
    });
  };
  const majorObj = major.toObject({
    virtuals: true
  });
  majorObj.benchmarks = calculateDeltas(major.benchmarks);
  const cleanName = major.name.trim().replace(/\s+/g, '\\s+');
  const otherSchools = await _models.Major.find({
    name: {
      $regex: new RegExp(`^${cleanName}$`, 'i')
    },
    _id: {
      $ne: major._id
    },
    status: 'active'
  }).populate('university', 'name code location');
  const otherSchoolsProcessed = otherSchools.map(s => {
    const sObj = s.toObject({
      virtuals: true
    });
    sObj.benchmarks = calculateDeltas(s.benchmarks);
    return sObj;
  });
  return {
    major: majorObj,
    otherSchools: otherSchoolsProcessed
  };
};
exports.getMajorByIdService = getMajorByIdService;
const updateMajorService = async (id, data) => {
  const major = await _models.Major.findById(id);
  if (!major) {
    (0, _helpers.abort)(404, 'Không tìm thấy ngành học');
  }
  const processArray = arr => {
    if (!arr) return [];
    return arr.flatMap(item => typeof item === 'string' ? item.split(',').map(s => s.trim()) : item).filter(Boolean);
  };
  if (data.groups) data.groups = processArray(data.groups);
  if (data.careers) data.careers = processArray(data.careers);
  if (data.curriculum) data.curriculum = processArray(data.curriculum);
  const result = await _models.Major.findByIdAndUpdate(id, data, {
    new: true
  }).populate('university');
  return result;
};
exports.updateMajorService = updateMajorService;
const deleteMajorService = async id => {
  const major = await _models.Major.findById(id);
  if (!major) {
    (0, _helpers.abort)(404, 'Không tìm thấy ngành học');
  }
  const result = await _models.Major.findByIdAndUpdate(id, {
    status: 'inactive'
  }, {
    new: true
  });
  return result;
};
exports.deleteMajorService = deleteMajorService;
const getMajorBySearch = async data => {
  const {
    keyword,
    q,
    code,
    name,
    university_id,
    category,
    page = 1,
    limit = 10
  } = data;
  const query = {
    status: 'active'
  };
  const searchVal = keyword || q || name || code;
  if (searchVal) {
    query.$or = [{
      name: {
        $regex: searchVal,
        $options: 'i'
      }
    }, {
      code: {
        $regex: searchVal,
        $options: 'i'
      }
    }];
  }
  if (university_id) query.university_id = university_id;
  if (category) query.category = category;
  const pageNum = Number(page);
  const limitNum = Number(limit);
  const skip = (pageNum - 1) * limitNum;
  const [majorSearch, total] = await Promise.all([_models.Major.find(query).skip(skip).limit(limitNum).populate('university', 'name code location'), _models.Major.countDocuments(query)]);
  const results = await Promise.all(majorSearch.map(async m => {
    const count = await _models.Major.countDocuments({
      name: {
        $regex: new RegExp(`^${m.name}$`, 'i')
      },
      status: 'active'
    });
    const mObj = m.toObject();
    mObj.schoolCount = count;
    return mObj;
  }));
  return {
    data: results,
    total,
    page: pageNum,
    limit: limitNum
  };
};
exports.getMajorBySearch = getMajorBySearch;
const getMajorByPages = async data => {
  const {
    limit = 10,
    page = 1
  } = data;
  const pageNum = Number(page);
  const LimitNum = Number(limit);
  const skip = (pageNum - 1) * LimitNum;
  const major = await _models.Major.find().skip(skip).limit(LimitNum).populate('university');
  const total = await _models.Major.countDocuments();
  return {
    major,
    total,
    page,
    limit,
    totalPage: Math.ceil(total / limit)
  };
};
exports.getMajorByPages = getMajorByPages;