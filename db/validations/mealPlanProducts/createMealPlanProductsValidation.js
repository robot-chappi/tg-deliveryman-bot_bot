const Joi = require('joi')

exports.createMealPlanProductsValidation = (data) => {
  const schema = Joi.object({
    meal_plan_id: Joi.number(),
    order_id: Joi.number(),
    products: Joi.any(),
  })

  return schema.validate(data);

}