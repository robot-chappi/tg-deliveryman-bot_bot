const ApiError = require('../error/ApiError')
const {User, FavoriteProduct} = require('../models/models')
const {createUserValidation} = require('../validations/user/createUserValidation')
const {updateUserValidation} = require('../validations/user/updateUserValidation')

class UserController {
  async getUsers(req, res) {
    try {
      const users = await User.findAll({ include: ["role", "tariff"] });
      return res.json(users)
    } catch (e) {
      console.log(e)
    }
  }

  async getUser(req, res) {
    try {
      const {id} = req.params
      const user = await User.findOne({where: {id: id}, include: ["role", "tariff"]})

      return res.json(user)
    } catch (e) {
      console.log(e)
    }
  }

  async createUser(req, res, next) {
    try {
      const {error} = createUserValidation(req.body);
      if(error) {
        return next(ApiError.badRequest('Что-то введено не верно'))
      }
      const {chatId, name, phoneNumber, address, roleId, tariffId} = req.body
      const user = await User.create({chatId, name, phoneNumber, address, roleId: roleId, tariffId: tariffId, favorite_product: {

        }}, {include: {
          model: FavoriteProduct,
          as: 'favorite_product'
        }})
      return res.json(user);
    } catch (e) {
      console.log(e)
    }
  }

  async deleteUser(req, res) {
    try {
      const {id} = req.params
      await User.destroy({where: {id: id}})
      return res.json({message: 'Успешно удалено'})
    } catch (e) {
      console.log(e)
    }
  }

  async patchUser(req, res, next) {
    try {
      const {error} = updateUserValidation(req.body);
      if(error) {
        return next(ApiError.badRequest('Что-то не правильно введено'))
      }

      const {id} = req.params
      const {chatId, name, phoneNumber, address, roleId, tariffId} = req.body
      await User.update({chatId: chatId, name: name, phoneNumber: phoneNumber, address: address, roleId: roleId, tariffId: tariffId}, {where: {id: id}})

      return res.json({message: 'Обновлено!'});
    } catch (e) {
      console.log(e)
    }
  }
}

module.exports = new UserController()