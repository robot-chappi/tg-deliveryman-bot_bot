const Joi = require('joi')

exports.deleteUnlovedIngredientsValidation = (data) => {
  const schema = Joi.object({
    unloved_ingredient_id: Joi.number(),
    unloved_ingredient_ingredient_id: Joi.number()
  })

  return schema.validate(data);

}