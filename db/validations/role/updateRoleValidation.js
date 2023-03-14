const Joi = require('joi')

exports.updateRoleValidation = (data) => {
  const schema = Joi.object({
    title: Joi.string(),
    slug: Joi.string()
  })

  return schema.validate(data);

}