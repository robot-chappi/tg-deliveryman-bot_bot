const Joi = require('joi')

exports.updateOrderValidation = (data) => {
  const schema = Joi.object({
    chatId: Joi.string(),
    fullname: Joi.string().min(2),
    phoneNumber: Joi.string(),
    address: Joi.string(),
    wish: Joi.string(),
    user_id: Joi.number(),
    typeOrderId: Joi.number(),
  })

  return schema.validate(data);

}