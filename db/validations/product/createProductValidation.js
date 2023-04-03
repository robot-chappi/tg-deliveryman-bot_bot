const Joi = require('joi')

exports.createProductValidation = (data) => {
  const schema = Joi.object({
    title: Joi.any(),
    weight: Joi.any(),
    image: Joi.any().allow(null),
    description: Joi.any(),
    price: Joi.any(),
    categoryId: Joi.any(),
    typeId: Joi.any(),
    ingredients: Joi.any()
  })

  return schema.validate(data);

}