import createModel from './base'

const AdmissionMethod = createModel(
    'AdmissionMethod',
    'admissionMethods',

    {
        code : {
            type : String,
            required : true
        },
        methodName : {
            type : String,
            required  : true
        },
        description : {
            type : String,
            required : true
        },
        status : {
            type : String,
            enum : ['Active', 'Inactive'],
            default: 'Active'
        }
    }
)

export default AdmissionMethod