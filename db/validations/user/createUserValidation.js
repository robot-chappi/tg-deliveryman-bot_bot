const Joi = require('joi')

exports.createUserValidation = (data) => {
  const schema = Joi.object({
    chatId: Joi.string(),
    name: Joi.string().min(2),
    phoneNumber: Joi.string(),
    address: Joi.string(),
    roleId: Joi.number(),
    tariffId: Joi.number()
  })

  return schema.validate(data);

}