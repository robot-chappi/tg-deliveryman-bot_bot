const Joi = require('joi')

exports.createOrderValidation = (data) => {
  const schema = Joi.object({
    chatId: Joi.string(),
    fullname: Joi.string().min(2),
    phoneNumber: Joi.string(),
    address: Joi.string(),
    wish: Joi.string(),
    price: Joi.string().allow(null),
    isComplete: Joi.boolean(),
    isPaid: Joi.boolean(),
    category_id: Joi.string(),
    typeOrderId: Joi.string(),
    user_id: Joi.string(),

    // chatId: Joi.string(),
    // fullname: Joi.string().min(2),
    // phoneNumber: Joi.string(),
    // address: Joi.string(),
    // wish: Joi.string(),
    // price: Joi.number().allow(null),
    // isComplete: Joi.boolean(),
    // isPaid: Joi.boolean(),
    // category_id: Joi.number(),
    // typeOrderId: Joi.number(),
    // user_id: Joi.number(),
  })

  return schema.validate(data);

}