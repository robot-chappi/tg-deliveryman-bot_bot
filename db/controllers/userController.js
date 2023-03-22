const ApiError = require('../error/ApiError')
const {User, FavoriteProduct, UnlovedIngredient, FavoriteIngredient} = require('../models/models')
const {createUserValidation} = require('../validations/user/createUserValidation')
const {updateUserValidation} = require('../validations/user/updateUserValidation')
const jwt = require('jsonwebtoken')

const generateJwt = (id, chatId, role) => {
  return jwt.sign(
    {id, chatId, role},
    process.env.SECRET_KEY,
    {expiresIn: '24h'}
  )
}

class UserController {
  async getUsers(req, res) {
    try {
      const users = await User.findAll({ include: ["role", "tariff"] });
      return res.json(users)
    } catch (e) {
      console.log(e)
    }
  }

  async getToken(req, res, next) {
    try {
      const {chatId} = req.params
      const user = await User.findOne({ where: {chatId: chatId}, include: ["role", "tariff"] });
      if(!user) {
        return next(ApiError.badRequest('Такого пользователя нету'))
      }

      const token = generateJwt(user.id, user.chatId, user.role.slug)

      return res.json({token})
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
    // mealPlan
    try {
      const {error} = createUserValidation(req.body);
      if(error) {
        return next(ApiError.badRequest('Что-то введено не верно'))
      }
      const {chatId, name, phoneNumber, address, roleId, tariffId} = req.body
      const user = await User.create({chatId, name, phoneNumber, address, roleId: roleId, tariffId: tariffId, favorite_product: {}, unloved_ingredient: {}, favorite_ingredient: {}}, {include: [{
          model: FavoriteProduct,
          as: 'favorite_product'
        },{
          model: UnlovedIngredient,
          as: 'unloved_ingredient'
        },{
          model: FavoriteIngredient,
          as: 'favorite_ingredient'
        }]})
      return res.json(user);
    } catch (e) {
      console.log(e)
    }
  }

  async deleteUser(req, res) {
    try {
      const {id} = req.params
      // you have to add method where favoriteproductproduct deletes too
      await FavoriteProduct.destroy({where: {userId: id}})
      await UnlovedIngredient.destroy({where: {userId: id}})
      await FavoriteIngredient.destroy({where: {userId: id}})
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