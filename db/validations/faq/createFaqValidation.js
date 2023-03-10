const Joi = require('joi')

exports.createFaqValidation = (data) => {
  const schema = Joi.object({
    title: Joi.string().min(3),
    description: Joi.string().min(15)
  })

  return schema.validate(data);

}