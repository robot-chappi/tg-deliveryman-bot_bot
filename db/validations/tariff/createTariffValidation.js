const Joi = require('joi')

exports.createTariffValidation = (data) => {
  const schema = Joi.object({
    title: Joi.string(),
    description: Joi.string().min(5),
    price: Joi.any(),
    discount: Joi.any(),
    privileges: Joi.any()
  })

  return schema.validate(data);

}