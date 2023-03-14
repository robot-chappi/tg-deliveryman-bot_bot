const ApiError = require('../error/ApiError')
const {Role} = require('../models/models')
const {createRoleValidation} = require('../validations/role/createRoleValidation')
const {updateRoleValidation} = require('../validations/role/updateRoleValidation')

class RoleController {
  async getRoles(req, res) {
    try {
      const roles = await Role.findAll();
      return res.json(roles)
    } catch (e) {
      console.log(e)
    }
  }

  async getRole(req, res) {
    try {
      const {id} = req.params
      const role = await Role.findOne({where: {id: id}})
      return res.json(role)
    } catch (e) {
      console.log(e)
    }
  }

  async createRole(req, res, next) {
    try {
      const {error} = createRoleValidation(req.body);
      if(error) {
        return next(ApiError.badRequest('Не введено название или slug роли'))
      }
      const {title, slug} = req.body
      const role = await Role.create({title, slug})
      return res.json(role);
    } catch (e) {
      console.log(e)
    }
  }

  async deleteRole(req, res) {
    try {
      const {id} = req.params
      await Role.destroy({where: {id: id}})
      return res.json({message: 'Успешно удалено'})
    } catch (e) {
      console.log(e)
    }
  }

  async patchRole(req, res, next) {
    try {
      const {error} = updateRoleValidation(req.body);
      if(error) {
        return next(ApiError.badRequest('Не введено название или slug роли'))
      }

      const {id} = req.params
      const {title, slug} = req.body

      await Role.update({title: title, slug: slug}, {where: {id: id}})
      return res.json({message: 'Обновлено!'});
    } catch (e) {
      console.log(e)
    }
  }
}

module.exports = new RoleController()