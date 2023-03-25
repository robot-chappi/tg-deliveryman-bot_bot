const ApiError = require('../error/ApiError')
const {Type} = require('../models/models')
const {createTypeValidation} = require('../validations/type/createTypeValidation')
const {updateTypeValidation} = require('../validations/type/updateTypeValidation')

class TypeController {
  async getTypes(req, res) {
    try {
      const types = await Type.findAll();
      return res.json(types)
    } catch (e) {
      console.log(e)
    }
  }

  async getType(req, res) {
    try {
      const {id} = req.params
      const type = await Type.findOne({where: {id: id}})
      return res.json(type)
    } catch (e) {
      console.log(e)
    }
  }

  async createType(req, res, next) {
    try {
      const {error} = createTypeValidation(req.body);
      if(error) {
        return next(ApiError.badRequest('Не введено название типа'))
      }
      const {title} = req.body
      const type = await Type.create({title})
      return res.json(type);
    } catch (e) {
      console.log(e)
    }
  }

  async deleteType(req, res) {
    try {
      const {id} = req.params
      await Type.destroy({where: {id: id}})
      return res.json({message: 'Успешно удалено'})
    } catch (e) {
      console.log(e)
    }
  }

  async patchType(req, res, next) {
    try {
      const {error} = updateTypeValidation(req.body);
      if(error) {
        return next(ApiError.badRequest('Не введено название типа'))
      }

      const {id} = req.params
      const {title} = req.body

      await Type.update({title: title}, {where: {id: id}})
      return res.json({message: 'Обновлено!'});
    } catch (e) {
      console.log(e)
    }
  }
}

module.exports = new TypeController()