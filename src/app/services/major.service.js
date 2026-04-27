import { Major, University } from '@/models'
import { abort } from '@/utils/helpers'


export const createMajorService = async (data) => {
    const {
        code, name, major, category, university_id, quota,
        description, duration, status,
        groups, careers, curriculum, benchmarks, employment_rate
    } = data

    const existingMajor = await Major.findOne({ code })
    if (existingMajor) {
        abort(400, 'Mã ngành đã tồn tại.')
    }

    const existingUniversity = await University.findById(university_id)
    if (!existingUniversity) {
        abort(404, 'Không tìm thấy trường đại học.')
    }

    const majorCount = await Major.countDocuments({ university_id })
    if (majorCount >= existingUniversity.majors) {
        abort(400, `Trường đại học này đã đạt giới hạn số lượng ngành học (${existingUniversity.majors} ngành).`)
    }

    const processArray = (arr) => {
        if (!arr) return []
        return arr.flatMap(item => typeof item === 'string' ? item.split(',').map(s => s.trim()) : item).filter(Boolean)
    }

    const newMajor = await Major.create({
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
    })

    const result = await Major.findOne(newMajor._id)
        .populate('university', 'name')

    return result
}

export const getMajorService = async () => {
    const major = await Major.find()
        .populate('university', 'name code location')

    if (!major) {
        abort(404, 'Không tìm thấy ngành học')
    }

    return major
}

export const getMajorByIdService = async (id) => {
    const major = await Major.findById(id)
        .populate('university', 'name code location')

    if (!major) {
        abort(404, 'Không tìm thấy ngành học')
    }

    const calculateDeltas = (benchmarks) => {
        if (!benchmarks || benchmarks.length === 0) return []
        const sorted = [...benchmarks].sort((a, b) => a.year - b.year)
        return sorted.map((item, index) => {
            const result = item.toObject ? item.toObject() : { ...item }
            result.valueDelta = null
            result.quotaDelta = null
            if (index > 0) {
                const prev = sorted[index - 1]
                if (item.value !== 'undefined' && prev.value !== 'undefined') {
                    const d = item.value - prev.value
                    result.valueDelta = d >= 0 ? `+${d.toFixed(1)}` : `${d.toFixed(1)}`
                }
                if (item.quota !== 'undefined' && prev.quota !== 'undefined') {
                    const d = item.quota - prev.quota
                    result.quotaDelta = d >= 0 ? `+${d.toFixed(1)}` : `${d.toFixed(1)}`
                }
            }
            return result
        })
    }

    // Process main major benchmarks
    const majorObj = major.toObject()
    majorObj.benchmarks = calculateDeltas(major.benchmarks)

    // Tìm các trường khác cũng đào tạo ngành này
    const otherSchools = await Major.find({
        name: { $regex: new RegExp(`^${major.name}$`, 'i') }, // Match exact name
        _id: { $ne: major._id },
        status: 'active'
    }).populate('university', 'name code location')

    const otherSchoolsProcessed = otherSchools.map(s => {
        const sObj = s.toObject()
        sObj.benchmarks = calculateDeltas(s.benchmarks)
        return sObj
    })

    return {
        major: majorObj,
        otherSchools: otherSchoolsProcessed
    }
}

export const updateMajorService = async (id, data) => {
    const major = await Major.findById(id)

    if (!major) {
        abort(404, 'Không tìm thấy ngành học')
    }

    const processArray = (arr) => {
        if (!arr) return []
        return arr.flatMap(item => typeof item === 'string' ? item.split(',').map(s => s.trim()) : item).filter(Boolean)
    }

    if (data.groups) data.groups = processArray(data.groups)
    if (data.careers) data.careers = processArray(data.careers)
    if (data.curriculum) data.curriculum = processArray(data.curriculum)

    const result = await Major.findByIdAndUpdate(id, data, { new: true })
        .populate('university')

    return result
}


export const deleteMajorService = async (id) => {
    const major = await Major.findById(id)

    if (!major) {
        abort(404, 'Không tìm thấy ngành học')
    }

    const result = await Major.findByIdAndUpdate(
        id,
        {
            status: 'inactive'
        },
        {
            new: true
        }
    )

    return result
}

export const getMajorBySearch = async (data) => {
    const { keyword, q, code, name, university_id, category, page = 1, limit = 10 } = data

    const query = { status: 'active' }
    const searchVal = keyword || q || name || code

    if (searchVal) {
        query.$or = [
            { name: { $regex: searchVal, $options: 'i' } },
            { code: { $regex: searchVal, $options: 'i' } }
        ]
    }

    if (university_id) query.university_id = university_id
    if (category) query.category = category

    const pageNum = Number(page)
    const limitNum = Number(limit)
    const skip = (pageNum - 1) * limitNum

    const [majorSearch, total] = await Promise.all([
        Major.find(query)
            .skip(skip)
            .limit(limitNum)
            .populate('university', 'name code location'),
        Major.countDocuments(query)
    ])

    const results = await Promise.all(majorSearch.map(async (m) => {
        const count = await Major.countDocuments({ 
            name: { $regex: new RegExp(`^${m.name}$`, 'i') }, 
            status: 'active' 
        })
        const mObj = m.toObject()
        mObj.schoolCount = count
        return mObj
    }))

    return {
        data: results,
        total,
        page: pageNum,
        limit: limitNum
    }
}

export const getMajorByPages = async (data) => {
    const { limit = 10, page = 1 } = data

    const pageNum = Number(page)
    const LimitNum = Number(limit)

    const skip = (pageNum - 1) * LimitNum

    const major = await Major.find()
        .skip(skip)
        .limit(LimitNum)
        .populate('university')

    const total = await Major.countDocuments()

    return {
        major,
        total,
        page,
        limit,
        totalPage: Math.ceil(total / limit)
    }
}