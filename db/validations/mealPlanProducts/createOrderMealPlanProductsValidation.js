const Joi = require('joi')

exports.createOrderMealPlanProductsValidation = (data) => {
  const schema = Joi.object({
    meal_plan_id: Joi.number(),
    order_id: Joi.number(),
    price: Joi.number().allow(null),
    products: Joi.any(),
  })

  return schema.validate(data);

}