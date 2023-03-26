const Joi = require('joi')

exports.deleteReviewValidation = (data) => {
  const schema = Joi.object({
    review_id: Joi.number(),
    chatId: Joi.string()
  })

  return schema.validate(data);

}