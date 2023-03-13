const Joi = require('joi')

exports.createProductValidation = (data) => {
  const schema = Joi.object({
    title: Joi.string().min(3),
    weight: Joi.number(),
    image: Joi.string(),
    description: Joi.string().min(15),
    price: Joi.number(),
    categoryId: Joi.number(),
    typeId: Joi.number(),
    ingredients: Joi.any()
  })

  return schema.validate(data);

}