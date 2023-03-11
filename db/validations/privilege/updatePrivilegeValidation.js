const Joi = require('joi')

exports.updatePrivilegeValidation = (data) => {
  const schema = Joi.object({
    title: Joi.string().min(4)
  })

  return schema.validate(data);

}