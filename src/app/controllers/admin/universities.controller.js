import * as universitiesService from '@/app/services/universities.service'

export const createItem = async (req, res) => {
    try {
        const data = req.body
        const university = await universitiesService.createUniversity(data);
        return res.status(201).json(university);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const getUniversity = async (req, res) => {
    try {
        const data = req.query
        const university = await universitiesService.getUniversity(data);
        return res.status(200).json(university);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}