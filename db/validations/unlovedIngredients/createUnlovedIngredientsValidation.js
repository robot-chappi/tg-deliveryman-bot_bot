const Joi = require('joi')

exports.createUnlovedIngredientsValidation = (data) => {
  const schema = Joi.object({
    unloved_ingredient_id: Joi.number(),
    ingredient_id: Joi.number(),
  })

  return schema.validate(data);

}