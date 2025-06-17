const Joi = require('joi');

const registrationSchema = Joi.object({
  first_name: Joi.string().min(2).max(100).required(),
  last_name: Joi.string().min(2).max(100).required(),
  middle_name: Joi.string().max(100).optional(),
  date_of_birth: Joi.date().less('now').optional(),
  phone_number: Joi.string().pattern(/^\+?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/).optional(),
  email: Joi.string().email().max(100).required(),
  snils: Joi.string().pattern(/^\d{11}$/).optional(),
  password: Joi.string().min(8).max(30).required()
});

const loginSchema = Joi.object({
  email: Joi.string().email().max(100).required(),
  password: Joi.string().min(8).max(30).required()
});

const resendActivationSchema = Joi.object({
  email: Joi.string().email().max(100).required()
});

const activateSchema = Joi.object({
  activationCode: Joi.string().required()
});

module.exports = {
  registrationSchema,
  loginSchema,
  resendActivationSchema,
  activateSchema
};