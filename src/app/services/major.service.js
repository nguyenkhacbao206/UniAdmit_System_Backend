import { Major, University } from '@/models'
import { abort } from '@/utils/helpers'


export const createMajorService = async (data) => {
    const { code, name, category, university_id, quota, description, duration, status } = data

    const existingMajor = await Major.findOne({ code })
    if (existingMajor) {
        abort(400, 'Mã ngành đã tồn tại.')
    }

    const existingUniversity = await University.findById(university_id)
    if (!existingUniversity) {
        abort(404, 'Không tìm thấy trường đại học.')
    }

    const major = await Major.create({
        code,
        name,
        category,
        university_id,
        quota,
        description,
        duration,
        status
    })

    const result = await Major.findOne(major._id)
        .populate('university', 'name')

    return result
}

export const getMajorService = async () => {
    const major = await Major.find()
        .populate('university', 'name code')

    if (!major) {
        abort(404, 'Không tìm thấy ngành học')
    }

    const result = major.map(item => ({
        _id: item._id,
        code: item.code,
        name: item.name,
        category: item.category,
        university_id: item.university_id,
        quota: item.quota,
        description: item.description,
        duration: item.duration,
        status: item.status,
        university: item.university.length
    }))
    return result
}

export const getMajorByIdService = async (id) => {
    const major = await Major.findById(id)

    if (!major) {
        abort(404, 'Không tìm thấy ngành học')
    }

    const result = await Major.findOne(major._id)
        .populate('university', 'name')

    return result
}

export const updateMajorService = async (id, data) => {
    const major = await Major.findById(id)

    if (!major) {
        abort(404, 'Không tìm thấy ngành học')
    }

    const result = await Major.findByIdAndUpdate(id, data, { new: true })

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
    const { code, name } = data

    const query = {}

    if (code) {
        query.name = {
            $regex: name,
            $options: 'i'
        }
    }

    if (name) {
        query.code = {
            $regex: name,
            $options: 'i'
        }
    }

    const majorSearch = await Major.find(query)

    return majorSearch
}

export const getMajorByPages = async (data) => {
    const { limit = 10, page = 1 } = data

    const pageNum = Number(page)
    const LimitNum = Number(limit)

    const skip = (pageNum - 1) * LimitNum

    const major = await Major.find()
        .skip(skip)
        .limit(limit)

    const total = await Major.countDocuments()

    return {
        major,
        total,
        page,
        limit,
        totalPage: Math.ceil(total / limit)
    }
}