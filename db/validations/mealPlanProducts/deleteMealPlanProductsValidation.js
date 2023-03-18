const Joi = require('joi')

exports.deleteMealPlanProductsValidation = (data) => {
  const schema = Joi.object({
    meal_plan_id: Joi.number(),
    meal_plan_product_id: Joi.number()
  })

  return schema.validate(data);

}