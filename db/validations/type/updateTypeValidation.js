const Joi = require('joi')

exports.updateTypeValidation = (data) => {
  const schema = Joi.object({
    title: Joi.string().min(3)
  })

  return schema.validate(data);

}