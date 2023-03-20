const Joi = require('joi')

exports.createMealPlanProductValidation = (data) => {
  const schema = Joi.object({
    meal_plan_id: Joi.number(),
    product_id: Joi.number(),
    name_day: Joi.string(),
    slug_day: Joi.string()
  })

  return schema.validate(data);

}