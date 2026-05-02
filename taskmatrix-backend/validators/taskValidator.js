const Joi = require("joi");

const taskSchema = Joi.object({
  title: Joi.string().min(3).required(),
  description: Joi.string().allow("").optional()
});

module.exports = taskSchema;