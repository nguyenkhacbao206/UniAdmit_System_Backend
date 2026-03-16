import createModel, { ObjectId } from './base'

const Score = createModel(
    'Score',
    'scores',
    {
        user_id: {
            type: ObjectId,
            ref: 'User',
            required: true,
            unique: true
        },
        // Các môn thi
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
        },

        
        // Dữ liệu tính toán
        combinations: {
            type: Object,
            default: {}
        },

        average: {
            type: Number,
            default: 0
        },
        
        verified: {
            type: Boolean,
            default: false
        }
    }
)

export default Score
