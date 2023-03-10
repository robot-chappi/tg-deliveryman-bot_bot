const Joi = require('joi')

exports.updateIngredientValidation = (data) => {
  const schema = Joi.object({
    title: Joi.string().min(2)
  })

  return schema.validate(data);

}