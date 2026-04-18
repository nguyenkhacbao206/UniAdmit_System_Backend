import { University } from '@/models'
import { abort } from '@/utils/helpers'

// import { options } from "joi";

export const createUniversity = async (data) => {
    const { code, name, location, majors, status } = data

    const university = await University.create({
        code,
        name,
        location,
        majors,
        status
    })

    return university

}

export const getUniversity = async () => {
    const university = await University.find()
    if (!university) {
        abort(404, 'Không tìm thấy trường đại học.')
    }
    return university
}

export const getUniversityById = async (id) => {
    const university = await University.findById(id)
    if (!university) {
        abort(404, 'Không tìm thấy trường đại học.')
    }
    return university
}


export const updateUniversity = async (id, data) => {
    const university = await University.findByIdAndUpdate(
        id,
        data,
        {
            new: true
        }
    )

    if (!university) {
        abort(404, 'Không tìm thấy trường đại học.')
    }

    return university
}

export const deleteUniversity = async (id) => {
    const university = await University.findByIdAndDelete(id)
    if (!university) {
        abort(404, 'Không tìm thấy trường đại học.')
    }
    return university
}

export const getUniversityBySearch = async (data) => {
    const { name, location, code } = data

    const query = {}

    if (name) {
        query.name = {
            $regex: name,
            $options: 'i'
        }
    }

    if (location) {
        query.location = {
            $regex: location,
            $options: 'i'
        }
    }

    if (code) {
        query.code = {
            $regex: code,
            $options: 'i'
        }
    }

    const university = await University.find(query)

    return university
}


export const getUniversityByPages = async (data) => {
    const { page = 1, limit = 10 } = data

    const pageNum = Number(page)
    const limitNum = Number(limit)
    const skip = (pageNum - 1) * limitNum

    const university = await University.find()
        .skip(skip)
        .limit(limit)

    const total = await University.countDocuments()

    return {
        university,
        total,
        page,
        limit,
        totalPage: Math.ceil(total / limit)
    }
}