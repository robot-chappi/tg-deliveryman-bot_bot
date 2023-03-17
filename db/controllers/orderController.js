const ApiError = require('../error/ApiError')
const {Order, MealPlan, User, FavoriteProduct, UnlovedIngredient, FavoriteIngredient} = require('../models/models')
const {createUserValidation} = require('../validations/user/createUserValidation')
const {updateUserValidation} = require('../validations/user/updateUserValidation')
const {createOrderValidation} = require('../validations/order/createOrderValidation')


class OrderController {
  async getOrders(req, res) {
    try {
      const orders = await Order.findAll({ include: ["user", "category"]})
      return res.json(orders)
    } catch (e) {
      console.log(e)
    }
  }

  async getOrder(req, res) {
    try {
      const {id} = req.params
      const order = await Order.findOne({where: {id: id}, include: ["user", "category"]})

      return res.json(order)
    } catch (e) {
      console.log(e)
    }
  }

  async createOrder(req, res, next) {
// mealPlan
    try {
      const {error} = createOrderValidation(req.body);
      if(error) {
        return next(ApiError.badRequest('Что-то введено не верно'))
      }
      const {chatId, fullname, phoneNumber, address, wish, price, isComplete, category_id} = req.body
      const order = await Order.create({chatId, fullname, phoneNumber, address, wish, price, isComplete, category_id, mealplan: {}}, {include: [{
          model: MealPlan,
          as: 'mealplan'
        }]})
      return res.json(order);
    } catch (e) {
      console.log(e)
    }
  }

  async completeOrder(req, res) {

  }

  async deleteOrder(req, res) {

  }

  async patchOrder(req, res) {

  }
}

module.exports = new OrderController()