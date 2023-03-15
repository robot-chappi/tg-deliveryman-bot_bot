const Joi = require('joi')

exports.deleteFavoriteIngredientsValidation = (data) => {
  const schema = Joi.object({
    favorite_ingredient_id: Joi.number(),
    favorite_ingredient_ingredient_id: Joi.number()
  })

  return schema.validate(data);

}