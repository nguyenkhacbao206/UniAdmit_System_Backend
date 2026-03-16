import createModel, {ObjectId} from './base'

const Profile = createModel(
    'Profile',
    'profiles',
    {
        user_id: {
            type: ObjectId,
            ref: 'User',
            required: true,
        },

        name: {
            type: String,
            required: true,
        },

        email: {
            type: String,
            lowercase: true,
        },

        phone: {
            type: String,
        },

        ethnicity: {
            type: String,
            default: '',
        },

        gender: {
            type: String,
            enum: ['male', 'female', 'other', ''],
            default: '',
        },

        dob: {
            type: Date,
            default: null,
        },

        permanentAddress: {
            type: String,
            default: '',
        },

        contactAddress: {
            type: String,
            default: '',
        },

        cccd: {
            type: String,
            default: '',
        },

        place_of_issue: {
            type: String,
            default: '',
        },

        avatar: {
            type: String,
            default: '',
        },
        
        cv: {
            type: String,
            default: '',
        },

        school: {
            type: String,
            default: '',
        },

        score: {
            type: Number,
            default: 0,
        },

        rank: {
            type: String,
            default: '',
        }
    }
)

export default Profile
