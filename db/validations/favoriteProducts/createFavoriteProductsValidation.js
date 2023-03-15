const Joi = require('joi')

exports.createFavoriteProductsValidation = (data) => {
  const schema = Joi.object({
    favorite_product_id: Joi.number(),
    product_id: Joi.number(),
  })

  return schema.validate(data);

}