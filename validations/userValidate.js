const Joi = require("joi");

const userValidate = Joi.object({
  username: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  age : Joi.number().positive().integer().required(),
  role : Joi.string().valid("admin" , "super_admin" , "user"). default("user").required(),
});

module.exports = { userValidate };
