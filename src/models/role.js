import createModel, {ObjectId} from './base'

const Role = createModel(
    'Role',
    'roles',
    {
        name: {
            type: String,
            required: true,
        },
        code: {
            type: String,
            default: null,
        },
        description: {
            type: String,
            default: '',
        },
        parent_id: {
            type: ObjectId,
            default: null,
            ref: 'Role'
        },
        can_edit: {
            type: Boolean,
            required: true,
            default: true,
        },
        can_delete: {
            type: Boolean,
            required: true,
            default: true,
        },
        permission_ids: {
            type: [ObjectId],
            required: true,
            default: [],
        }
    }
)

export default Role
