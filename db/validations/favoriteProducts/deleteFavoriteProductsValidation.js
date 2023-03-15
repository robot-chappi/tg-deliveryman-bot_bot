const Joi = require('joi')

exports.deleteFavoriteProductsValidation = (data) => {
  const schema = Joi.object({
    favorite_product_id: Joi.number(),
    favorite_product_product_id: Joi.number()
  })

  return schema.validate(data);

}