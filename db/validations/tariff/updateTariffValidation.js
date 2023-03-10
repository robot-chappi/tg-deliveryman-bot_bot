const Joi = require('joi')

exports.updateTariffValidation = (data) => {
  const schema = Joi.object({
    title: Joi.string(),
    description: Joi.string().min(5),
    price: Joi.number(),
    discount: Joi.number(),
    privileges: Joi.any()
  })

  return schema.validate(data);

}