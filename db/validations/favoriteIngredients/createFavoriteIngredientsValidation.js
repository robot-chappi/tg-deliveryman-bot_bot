const Joi = require('joi')

exports.createFavoriteIngredientsValidation = (data) => {
  const schema = Joi.object({
    favorite_ingredient_id: Joi.number(),
    ingredient_id: Joi.number(),
  })

  return schema.validate(data);

}