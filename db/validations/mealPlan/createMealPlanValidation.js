const Joi = require('joi')

exports.createMealPlanValidation = (data) => {
  const schema = Joi.object({
    monday: Joi.array(),
    tuesday: Joi.array(),
    wednesday: Joi.array(),
    thursday: Joi.array(),
    friday: Joi.array(),
    saturday: Joi.array(),
    sunday: Joi.array(),
  })

  return schema.validate(data);

}