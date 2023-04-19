const Joi = require('joi')

exports.updateProductValidation = (data) => {
  const schema = Joi.object({
    title: Joi.string().min(3),
    weight: Joi.number(),
    image: Joi.any().allow(null),
    imageFile: Joi.any().allow(null),
    description: Joi.string(),
    price: Joi.number(),
    categoryId: Joi.number(),
    typeId: Joi.number(),
    ingredients: Joi.any()
  })

  return schema.validate(data);

}