const Joi = require('joi')

exports.createOrderValidation = (data) => {
  const schema = Joi.object({
    chatId: Joi.string(),
    fullname: Joi.string().min(2),
    phoneNumber: Joi.string(),
    address: Joi.string(),
    wish: Joi.string(),
    price: Joi.number(),
    isComplete: Joi.boolean(),
    category_id: Joi.number(),
    user_id: Joi.number(),
    typeOrderId: Joi.number(),

  })

  return schema.validate(data);

}