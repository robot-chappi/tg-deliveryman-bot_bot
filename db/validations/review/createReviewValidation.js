const Joi = require('joi')

exports.createReviewValidation = (data) => {
  const schema = Joi.object({
    text: Joi.string(),
    mark: Joi.number(),
    chatId: Joi.string(),
    isChecked: Joi.boolean()
  })

  return schema.validate(data);

}