const ApiError = require('../error/ApiError')
const {Faq} = require('../models/models')
const {createFaqValidation} = require('../validations/faq/createFaqValidation')
const {updateFaqValidation} = require('../validations/faq/updateFaqValidation')

class FaqController {
  async getFaqs(req, res) {
    try {
      const faqs = await Faq.findAll();
      return res.json(faqs)
    } catch (e) {
      console.log(e)
    }
  }

  async getFaq(req, res) {
    try {
      const {id} = req.params
      const faq = await Faq.findOne({where: {id: id}})
      return res.json(faq)
    } catch (e) {
      console.log(e)
    }
  }

  async createFaq(req, res, next) {
    try {
      const {error} = createFaqValidation(req.body);
      if(error) {
        return next(ApiError.badRequest('Не введено название или описание faq'))
      }
      const {title, description} = req.body
      const faq = await Faq.create({title, description})
      return res.json(faq);
    } catch (e) {
      console.log(e)
    }
  }

  async deleteFaq(req, res) {
    try {
      const {id} = req.params
      await Faq.destroy({where: {id: id}})
      return res.json({message: 'Успешно удалено'})
    } catch (e) {
      console.log(e)
    }
  }

  async patchFaq(req, res, next) {
    try {
      const {error} = updateFaqValidation(req.body);
      if(error) {
        return next(ApiError.badRequest('Не введено название или описание faq'))
      }

      const {id} = req.params
      const {title, description} = req.body

      await Faq.update({title: title, description: description}, {where: {id: id}})
      return res.json({message: 'Обновлено!'});
    } catch (e) {
      console.log(e)
    }
  }
}

module.exports = new FaqController()