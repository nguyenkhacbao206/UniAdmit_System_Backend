import { Enrollment } from '@/models'
import { abort } from '@/utils/helpers'

export const createEnrollmentService = async (data) => {
    const { code, name, year, status, startDate, endDate } = data

    const checkCode = await Enrollment.findOne({ code })

    if (checkCode) {
        abort(400, 'Mã tuyển sinh đã tồn tại')
    }

    const enrollment = await Enrollment.create({
        code,
        name,
        year,
        status,
        startDate,
        endDate
    })

    return enrollment
}

export const getEnrollmentService = async () => {
    const enrollment = await Enrollment.find()
    return enrollment
}

export const getEnrollmentByIdService = async (id) => {
    const enrollment = await Enrollment.findById(id)

    if (!enrollment) {
        abort(400, 'không tồn tại đợi tuyển sinh')
    }

    return enrollment
}

export const updateEnrollment = async (id, data) => {
    const updateData = await Enrollment.findByIdAndUpdate(
        id,
        data,
        { new: true }
    )

    if (!updateData) {
        abort(400, 'Không tìm thấy thông tin tuyển sinh')
    }

    return updateData
}

export const deleteEnrollment = async (id) => {
    const deleteData = await Enrollment.findByIdAndDelete(id)

    if (!deleteData) {
        abort(400, 'Không tìm thấy thông tin tuyển sinh')
    }

    return deleteData
}

export const getEnrollmentBySearch = async (data) => {
    const { code, name, year } = data
    const query = {}

    if (code) {
        query.code = {
            $regex: code,
            $option: 'i'
        }
    }

    if (name) {
        query.name = {
            $regex: name,
            $option: 'i'
        }
    }

    if (year) {
        query.year = {
            $regex: year,
            $option: 'i'
        }
    }

    const search = await Enrollment.find(query)

    return search
}

export const getEnrollmentByPages = async (data) => {
    const { page = 1, limit = 10 } = data

    const pageNum = Number(page)
    const limitNum = Number(limit)

    const skip = (pageNum - 1) * limitNum

    const enrollment = await Enrollment.find()
        .skip(skip)
        .limit(limit)

    const total = await Enrollment.countDocuments()

    const totalPage = Math.ceil(total / limit)

    return {
        enrollment,
        total,
        page,
        limit,
        totalPage
    }
}