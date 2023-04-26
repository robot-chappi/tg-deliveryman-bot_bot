const ApiError = require('../error/ApiError')
const {User, FavoriteProduct, UnlovedIngredient, FavoriteIngredient, Tariff, PrivilegeTariff, Order, MealPlan,
  MealPlanProduct, FavoriteProductProduct, FavoriteIngredientIngredient, UnlovedIngredientIngredient, Product,
  Ingredient, Category, TypeOrder
} = require('../models/models')
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

  async paginationUser(req, res) {
    try {
      let {roleId, tariffId, limit, page} = req.query
      page = page || 1
      limit = limit || 3
      let offset = page * limit - limit
      let users;
      if (!roleId && !tariffId) {
        users = await User.findAndCountAll({limit: limit, offset: offset, include: ["role", "tariff"]});
      }
      if (roleId && !tariffId) {
        users = await User.findAndCountAll({where: {roleId: roleId}, limit: limit, offset: offset, include: ["role", "tariff"]});
      }
      if (!roleId && tariffId) {
        users = await User.findAndCountAll({where: {tariffId: tariffId}, limit: limit, offset: offset, include: ["role", "tariff"]});
      }
      if (roleId && tariffId) {
        users = await User.findAndCountAll({where: {roleId: roleId, tariffId: tariffId}, limit: limit, offset: offset, include: ["role", "tariff"]});
      }

      return res.json(users);

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

  async getUserWithAllInformation(req, res) {
    try {
      const {id} = req.params
      let initialUser = await User.findOne({where: {id: id}, include: ['role', 'tariff']})
      const orders = await Order.findAll({where: {userId: initialUser.id}, include: [{model: MealPlan, include: [{model: MealPlanProduct, include: [{model: Product}]}, {model: Category}]}, {model: TypeOrder}]})
      if (initialUser) {
        const favoriteIngredientItem = await FavoriteIngredient.findOne({where: {userId: id}, include: [{model: FavoriteIngredientIngredient, include: [{model: Ingredient}]}]})
        const unlovedIngredientItem = await UnlovedIngredient.findOne({where: {userId: id}, include: [{model: UnlovedIngredientIngredient, include: [{model: Ingredient}]}]})
        const favoriteProductItem = await FavoriteProduct.findOne({where: {userId: id}, include: [{model: FavoriteProductProduct, include: [{model: Product}]}]})
        if (orders.length >= 1) return res.json({user: initialUser, favorite_ingredient: favoriteIngredientItem, favorite_product: favoriteProductItem, unloved_ingredient: unlovedIngredientItem, orders: orders})
        return res.json({user: initialUser, favorite_ingredient: favoriteIngredientItem, favorite_product: favoriteProductItem, unloved_ingredient: unlovedIngredientItem})
      }

      return res.json({message: 'Пользователя нету', status: 'error'})
    } catch (e) {
      console.log(e)
    }
  }

  async getMe(req, res) {
    try {
      const {chatId} = req.params
      const user = await User.findOne({where: {chatId: chatId}, include: ["role", "tariff"]})
      return res.json(user)
    } catch (e) {
      console.log(e)
    }
  }

  async getMyFavoriteProduct(req, res) {
    try {
      const {chatId} = req.params
      const user = await User.findOne({where: {chatId: chatId}})
      if (!user) return res.json('Error!')
      const favoriteProduct = await FavoriteProduct.findOne({where: {userId: user.id}})
      return res.json(favoriteProduct)
    } catch (e) {
      console.log(e)
    }
  }

  async getMyFavoriteIngredient(req, res) {
    try {
      const {chatId} = req.params
      const user = await User.findOne({where: {chatId: chatId}})
      if (!user) return res.json('Error!')
      const favoriteIngredient = await FavoriteIngredient.findOne({where: {userId: user.id}})
      return res.json(favoriteIngredient)
    } catch (e) {
      console.log(e)
    }
  }

  async getMyUnlovedIngredient(req, res) {
    try {
      const {chatId} = req.params
      const user = await User.findOne({where: {chatId: chatId}})
      if (!user) return res.json('Error!')
      const unlovedIngredient = await UnlovedIngredient.findOne({where: {userId: user.id}})
      return res.json(unlovedIngredient)
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

      const foundUser = await User.findOne({where: {chatId: chatId}})
      if (foundUser) return res.json({message: 'Такой пользователь уже есть!', status: 'error'})
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
      const favoriteProductItem = await FavoriteProduct.findOne({where: {userId: id}})
      if (favoriteProductItem) {
        await FavoriteProductProduct.destroy({where: {favoriteProductId: favoriteProductItem.id}})
        await favoriteProductItem.destroy()
      }

      const unlovedIngredientItem = await UnlovedIngredient.findOne({where: {userId: id}})
      if (unlovedIngredientItem) {
        await UnlovedIngredientIngredient.destroy({where: {unlovedIngredientId: unlovedIngredientItem.id}})
        await unlovedIngredientItem.destroy()
      }

      const favoriteIngredientItem = await FavoriteIngredient.findOne({where: {userId: id}})
      if (favoriteIngredientItem) {
        await FavoriteIngredientIngredient.destroy({where: {favoriteIngredientId: favoriteIngredientItem.id}})
        await favoriteIngredientItem.destroy()
      }

      const orders = await Order.findAll({where: {userId: id}})

      if (orders.length < 1) {
        await User.destroy({where: {id: id}})
      } else {
        orders.forEach(async (i) => {
          const mealPlanItem = await MealPlan.findOne({where: {orderId: i.id}})
          await MealPlanProduct.destroy({where: {mealplanId: mealPlanItem.id}})

          const orderItem = await Order.findOne({where: {id: i.id}})
          await mealPlanItem.destroy();
          await orderItem.destroy();
        })

        await User.destroy({where: {id: id}})
      }

      return res.json({message: 'Успешно удалено'})
    } catch (e) {
      console.log(e)
    }
  }

  async changeUserTariff(req, res) {
    try {
      const {chatId, tariffTitle} = req.body
      const tariff = await Tariff.findOne({where: {title: tariffTitle}})
      if (!tariff) return res.json({message: 'Не вышло!'})
      await User.update({tariffId: tariff.id}, {where: {chatId: chatId}})

      return res.json({message: 'Обновлено!'});
    } catch (e) {
      console.log(e)
    }
  }

  async changeUser(req, res, next) {
    try {
      const {error} = updateUserValidation(req.body);
      if(error) {
        return next(ApiError.badRequest('Что-то не правильно введено'))
      }

      let {chatId, name, phoneNumber, address, roleId, tariffId} = req.body
      await User.update({chatId: chatId, name: name, phoneNumber: phoneNumber, address: address, roleId: roleId, tariffId: tariffId}, {where: {chatId: chatId}})

      return res.json({message: 'Обновлено!'});
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