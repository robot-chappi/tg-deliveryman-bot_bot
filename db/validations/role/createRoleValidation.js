const Joi = require('joi')

exports.createRoleValidation = (data) => {
  const schema = Joi.object({
    title: Joi.string(),
    slug: Joi.string()
  })

  return schema.validate(data);

}