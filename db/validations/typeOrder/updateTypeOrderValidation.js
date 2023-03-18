const Joi = require('joi')

exports.updateTypeOrderValidation = (data) => {
  const schema = Joi.object({
    title: Joi.string().min(3),
    slug: Joi.string()
  })

  return schema.validate(data);

}