import Joi from 'joi'

export const loginUniversal = Joi.object({
    identifier: Joi.string().label('Email hoặc số điện thoại'),
    username: Joi.string().label('Tên đăng nhập'),
    password: Joi.string().required().messages({
        'any.required': 'Vui lòng nhập mật khẩu',
        'string.empty': 'Vui lòng nhập mật khẩu',
    }),
}).xor('identifier', 'username').messages({
    'object.missingVariant': 'Vui lòng điền email hoặc số điện thoại',
    'object.xor': 'Vui lòng điền email hoặc số điện thoại',
})
