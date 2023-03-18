const ApiError = require('../error/ApiError')
const {Order, MealPlan, MealPlanProduct} = require('../models/models')
const {createOrderValidation} = require('../validations/order/createOrderValidation')
const {updateOrderValidation} = require('../validations/order/updateOrderValidation')


class OrderController {
  async getOrders(req, res) {
    try {
      const orders = await Order.findAll({ include: ["user", "category", "type_order"]})
      return res.json(orders)
    } catch (e) {
      console.log(e)
    }
  }

  async getOrder(req, res) {
    try {
      const {id} = req.params
      const order = await Order.findOne({where: {id: id}, include: ["user", "category", "type_order"]})

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
      const {chatId, fullname, phoneNumber, address, wish, price, isComplete, category_id, user_id, typeOrderId} = req.body
      const order = await Order.create({chatId, fullname, phoneNumber, address, wish, price, isComplete, categoryId: category_id, userId: user_id, typeOrderId: typeOrderId, mealplan: {}}, {include: [{
          model: MealPlan,
          as: 'mealplan'
        }]})
      return res.json(order);
    } catch (e) {
      console.log(e)
    }
  }

  async completeUncompleteOrder(req, res) {
    try {
      const {id} = req.params
      const order = await Order.findOne({where: {id: id}})
      await order.update({isComplete: order['isComplete'] ? 1 : 0})

      return res.json({message: 'Обновлено!'});
    } catch (e) {
      console.log(e)
    }
  }

  async deleteOrder(req, res) {
    try {
      const {id} = req.params
      // you have to add method where mealPlanProduct deletes too
      let mealPlanId;
      await MealPlan.findOne({where: {orderId: id}}).then(item => {
        mealPlanId = item['id']
        return item.destroy()
      })
      await MealPlanProduct.destroy({where: {mealplanId: mealPlanId}})
      await Order.destroy({where: {id: id}})

      return res.json({message: 'Успешно удалено'})
    } catch (e) {
      console.log(e)
    }
  }

  async patchOrder(req, res, next) {
    try {
      const {error} = updateOrderValidation(req.body);
      if(error) {
        return next(ApiError.badRequest('Что-то не правильно введено'))
      }

      const {id} = req.params
      const {chatId, fullname, phoneNumber, address, wish, price, category_id, user_id, typeOrderId} = req.body
      await Order.update({chatId: chatId, fullname: fullname, phoneNumber: phoneNumber, address: address, wish: wish, price: price, categoryId: category_id, userId: user_id, typeOrderId: typeOrderId}, {where: {id: id}})

      return res.json({message: 'Обновлено!'});
    } catch (e) {
      console.log(e)
    }
  }
}

module.exports = new OrderController()