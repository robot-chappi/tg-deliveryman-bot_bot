const ApiError = require('../error/ApiError')
const {Privilege} = require('../models/models')
const {createPrivilegeValidation} = require('../validations/privilege/createPrivilegeValidation')
const {updatePrivilegeValidation} = require('../validations/privilege/updatePrivilegeValidation')

class PrivilegeController {
  async getPrivileges(req, res) {
    try {
      const privileges = await Privilege.findAll();
      return res.json(privileges)
    } catch (e) {
      console.log(e)
    }
  }

  async getPrivilege(req, res) {
    try {
      const {id} = req.params
      const privilege = await Privilege.findOne({where: {id: id}})
      return res.json(privilege)
    } catch (e) {
      console.log(e)
    }
  }

  async createPrivilege(req, res, next) {
    try {
      const {error} = createPrivilegeValidation(req.body);
      if(error) {
        return next(ApiError.badRequest('Не введено название привелегии'))
      }
      const {title} = req.body
      const privilege = await Privilege.create({title})
      return res.json(privilege);
    } catch (e) {
      console.log(e)
    }
  }

  async deletePrivilege(req, res) {
    try {
      const {id} = req.params
      await Privilege.destroy({where: {id: id}})
      return res.json({message: 'Успешно удалено'})
    } catch (e) {
      console.log(e)
    }
  }

  async patchPrivilege(req, res, next) {
    try {
      const {error} = updatePrivilegeValidation(req.body);
      if(error) {
        return next(ApiError.badRequest('Не введено название привелегии'))
      }

      const {id} = req.params
      const {title} = req.body

      await Privilege.update({title: title}, {where: {id: id}})
      return res.json({message: 'Обновлено!'});
    } catch (e) {
      console.log(e)
    }
  }
}

module.exports = new PrivilegeController()