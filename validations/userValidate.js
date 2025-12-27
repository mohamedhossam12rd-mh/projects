const Joi  = require("joi")


const userValidate = Joi.object({
    email : Joi.string().required(),
    password : Joi.string.required()
})

module.exports = {userValidate}