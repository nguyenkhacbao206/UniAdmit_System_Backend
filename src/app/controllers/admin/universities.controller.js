import * as universitiesService from '@/app/services/universities.service'

export const getList = async (req, res) => {
    const { q, page, per_page } = req.query

    if (q) {
        // If there's a search term, use the search service
        const data = await universitiesService.getUniversityBySearch({ name: q, code: q })
        return res.status(200).json({
            items: data,
            total: data.length,
            page: 1,
            limit: data.length,
            totalPage: 1
        })
    }

    // Otherwise use pagination
    const data = await universitiesService.getUniversityByPages({ page, limit: per_page })
    // Map data from service ({university, total, page, limit, totalPage}) to standard format
    return res.status(200).json({
        items: data.university,
        total: data.total,
        page: data.page,
        limit: data.limit,
        totalPage: data.totalPage
    })
}

export const getDetail = async (req, res) => {
    const data = await universitiesService.getUniversityById(req.params.universityId)
    return res.status(200).json(data)
}

export const createItem = async (req, res) => {
    // Note: the request validation uses "majors" but the service expects "major"
    const payload = { ...req.body, major: req.body.majors }
    const university = await universitiesService.createUniversity(payload)
    return res.status(201).json(university)
}

export const updateItem = async (req, res) => {
    const payload = { ...req.body, major: req.body.majors }
    const university = await universitiesService.updateUniversity(req.params.universityId, payload)
    return res.status(200).json(university)
}

export const deleteItem = async (req, res) => {
    const university = await universitiesService.deleteUniversity(req.params.universityId)
    return res.status(200).json(university)
}