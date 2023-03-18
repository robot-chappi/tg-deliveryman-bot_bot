const ApiError = require('../error/ApiError')
const {TypeOrder} = require('../models/models')
const {createTypeOrderValidation} = require('../validations/typeOrder/createTypeOrderValidation')
const {updateTypeOrderValidation} = require('../validations/typeOrder/updateTypeOrderValidation')

class TypeOrderController {
  async getTypesOrder(req, res) {
    try {
      const types = await TypeOrder.findAll();
      return res.json(types)
    } catch (e) {
      console.log(e)
    }
  }

  async getTypeOrder(req, res) {
    try {
      const {id} = req.params
      const type = await TypeOrder.findOne({where: {id: id}})
      return res.json(type)
    } catch (e) {
      console.log(e)
    }
  }

  async createTypeOrder(req, res, next) {
    try {
      const {error} = createTypeOrderValidation(req.body);
      if(error) {
        return next(ApiError.badRequest('Не введено название или распознование типа заказа'))
      }
      const {title, slug} = req.body
      const type = await TypeOrder.create({title, slug})
      return res.json(type);
    } catch (e) {
      console.log(e)
    }
  }

  async deleteTypeOrder(req, res) {
    try {
      const {id} = req.params
      await TypeOrder.destroy({where: {id: id}})
      return res.json({message: 'Успешно удалено'})
    } catch (e) {
      console.log(e)
    }
  }

  async patchTypeOrder(req, res, next) {
    try {
      const {error} = updateTypeOrderValidation(req.body);
      if(error) {
        return next(ApiError.badRequest('Не введено название или распознование типа заказа'))
      }

      const {id} = req.params
      const {title, slug} = req.body

      await TypeOrder.update({title: title, slug: slug}, {where: {id: id}})
      return res.json({message: 'Обновлено!'});
    } catch (e) {
      console.log(e)
    }
  }
}

module.exports = new TypeOrderController()