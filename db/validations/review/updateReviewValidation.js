const Joi = require('joi')

exports.updateReviewValidation = (data) => {
  const schema = Joi.object({
    text: Joi.string(),
    mark: Joi.number(),
    chatId: Joi.string(),
    isChecked: Joi.boolean()
  })

  return schema.validate(data);

}