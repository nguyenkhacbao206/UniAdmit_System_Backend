import { Staff } from '@/models'
import { abort } from '@/utils/helpers'

export const createStaffService = async (data) => {
    const { name, mail, phone, password, status } = data

    const staff = await Staff.create({
        name,
        mail,
        phone,
        password,
        status
    })

    return staff
}

export const getStaffService = async () => {
    const getStaff = await Staff.find()

    if (!getStaff) {
        abort(400, 'Không tìm thấy nhân viên')
    }

    return getStaff
}

export const getStaffByIdService = async (id) => {
    const getStaff = await Staff.findById(id)

    if (!getStaff) {
        abort(400, 'Không tìm thấy nhân viên')
    }

    return getStaff
}

export const updateStaffService = async (id, data) => {
    const updateStaff = await Staff.findByIdAndUpdate(
        id,
        data,
        {
            new: true
        }
    )

    if (!updateStaff) {
        abort(400, 'Không tìm thấy nhân viên')
    }

    return updateStaff
}

export const deleteStaffService = async (id) => {
    const deleteStaff = await Staff.findByIdAndDelete(id)

    if (!deleteStaff) {
        abort(400, 'Không tìm thấy nhân viên')
    }

    return deleteStaff
}

export const getStaffBySearchService = async (data) => {
    const { name, mail, phone } = data

    const query = {}

    if (name) {
        query.name = {
            $regex: name,
            $options: 'i'
        }
    }

    if (mail) {
        query.mail = {
            $regex: mail,
            $options: 'i'
        }
    }

    if (phone) {
        query.phone = {
            $regex: phone,
            $options: 'i'
        }
    }

    const staff = await Staff.find(query)

    return staff
}


export const getStaffByPagesService = async (data) => {
    const { page = 1, limit = 10 } = data

    const pageNum = Number(page)
    const limitNum = Number(limit)
    const skip = (pageNum - 1) * limitNum

    const staff = await Staff.find()
        .skip(skip)
        .limit(limit)

    const total = await Staff.countDocuments()

    return {
        staff,
        total,
        page,
        limit,
        totalPage: Math.ceil(total / limit)
    }
}