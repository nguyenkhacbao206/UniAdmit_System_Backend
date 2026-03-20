import createModel, { ObjectId } from './base'

const AcademicScore = createModel(
    'AcademicScore',
    'academic_scores',
    {
        user_id: {
            type: ObjectId,
            ref: 'User',
            required: true,
            unique: true
        },
        semesters: [
            {
                name: { 
                    type: String, 
                    required: true 
                }, // ví dụ: hk1_lop11
                scores: {
                    math: { 
                        type: Number, 
                        default: 0 
                    },
                    literature: { 
                        type: Number, 
                        default: 0 
                    },
                    english: { 
                        type: Number, 
                        default: 0 
                    },
                    physics: { 
                        type: Number, 
                        default: 0 
                    },
                    chemistry: { 
                        type: Number, 
                        default: 0 
                    },
                    biology: { 
                        type: Number, 
                        default: 0 
                    },
                    history: {
                        type: Number, 
                        default: 0 
                    },
                    geography: { 
                        type: Number, 
                        default: 0 
                    },
                    civic_education: { 
                        type: Number, 
                        default: 0 
                    }
                },
                average: { 
                    type: Number, 
                    default: 0 
                },
                conduct: { 
                    type: String, 
                    default: 'Tốt' 
                }, // Hạnh kiểm
                academic_rank: { 
                    type: String, 
                    default: 'Giỏi' 
                } // Học lực
            }
        ]
    }
)

export default AcademicScore
