const Joi = require('joi')

exports.createOrderMealPlanProductsValidation = (data) => {
  const schema = Joi.object({
    meal_plan_id: Joi.string(),
    order_id: Joi.string(),
    price: Joi.string().allow(null),
    products: Joi.any(),

    // meal_plan_id: Joi.number(),
    // order_id: Joi.number(),
    // price: Joi.number().allow(null),
    // products: Joi.any(),
  })

  return schema.validate(data);

}