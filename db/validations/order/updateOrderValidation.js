const Joi = require('joi')

exports.updateOrderValidation = (data) => {
  const schema = Joi.object({
    fullname: Joi.string().min(2),
    phoneNumber: Joi.string(),
    address: Joi.string(),
    wish: Joi.string(),
    price: Joi.number(),
    isComplete: Joi.boolean(),
    category_id: Joi.number()
  })

  return schema.validate(data);

}