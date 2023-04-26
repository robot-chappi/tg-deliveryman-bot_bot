const ApiError = require('../error/ApiError')
const {Order, MealPlan, MealPlanProduct, Product, Ingredient, IngredientProduct} = require('../models/models')
const {createOrderValidation} = require('../validations/order/createOrderValidation')
const {updateOrderValidation} = require('../validations/order/updateOrderValidation')


class OrderController {
  async getOrders(req, res) {
    try {
      const orders = await Order.findAll({ include: ["user", "type_order"]})
      return res.json(orders)
    } catch (e) {
      console.log(e)
    }
  }

  async getCompletedOrders(req, res) {
    try {
      const orders = await Order.findAll({where: {isComplete: true} , include: ["user", "type_order"]})
      return res.json(orders)
    } catch (e) {
      console.log(e)
    }
  }

  async getUserOrder(req, res) {
    try {
      const {chatId} = req.params

      const order = await Order.findOne({where: {chatId: chatId, isPaid: false}, include: ["user", "type_order", {model: MealPlan, include: ["category"]}]})

      return res.json(order)
    } catch (e) {
      console.log(e)
    }
  }

  async getAllUserOrders(req, res) {
    try {
      const {chatId} = req.params
      const orders = await Order.findAll({where: {chatId: chatId}, include: ["user", "type_order"]})

      return res.json(orders)
    } catch (e) {
      console.log(e)
    }
  }

  async getOrder(req, res) {
    try {
      const {id} = req.params
      const order = await Order.findOne({where: {id: id}, include: ["user", "type_order"]})

      return res.json(order)
    } catch (e) {
      console.log(e)
    }
  }

  async createOrder(req, res, next) {
    try {
      const {error} = createOrderValidation(req.body);
      if(error) {
        return next(ApiError.badRequest('Что-то введено не верно'))
      }
      const {chatId, fullname, phoneNumber, address, wish, price, isComplete, isPaid, category_id, user_id, typeOrderId} = req.body
      const findOrder = await Order.findAll({where: {chatId: chatId}})

      let end = false;
      findOrder.forEach(i => {
        if (i.isPaid !== true) return end = true;
      })

      if (end) {
        return res.json({message: 'Заказ уже сушествует, удалите его или оплатите', error: true})
      }

      const order = await Order.create({chatId, fullname, phoneNumber, address, wish, isComplete, isPaid, userId: user_id, typeOrderId: typeOrderId, mealplan: {categoryId: category_id, price: Number(price)}}, {include: [{
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
      await order.update({isComplete: order['isComplete'] ? false : true})

      return res.json({message: 'Обновлено!'});
    } catch (e) {
      console.log(e)
    }
  }

  async payUnpayOrder(req, res) {
    try {
      const {id} = req.params
      const order = await Order.findOne({where: {id: id}})
      await order.update({isPaid: order['isPaid'] ? false : true})

      return res.json({message: 'Обновлено!'});
    } catch (e) {
      console.log(e)
    }
  }

  async deleteUserOrders(req, res) {
    try {
      const {chatId} = req.params
      const orders = await Order.findAll({where: {chatId: chatId}})

      if (orders.length < 1) return res.json({message: 'Заказов нету', status: 'error'})
      orders.forEach(async (i) => {
        const mealPlanItem = await MealPlan.findOne({where: {orderId: i.id}})
        await MealPlanProduct.destroy({where: {mealplanId: mealPlanItem.id}})

        const orderItem = await Order.findOne({where: {id: i.id}})
        await mealPlanItem.destroy();
        await orderItem.destroy();
      })

      return res.json({message: 'Успешно удалено'})
    } catch (e) {
      console.log(e)
    }
  }

  async deleteUserOrder(req, res) {
    try {
      const {chatId} = req.params

      const order = await Order.findOne({where: {chatId: chatId, isPaid: false}})

      if (!order) return res.json({message: 'Заказа такого нету', status: 'error'})

      let mealPlanId;
      await MealPlan.findOne({where: {orderId: order.id}}).then(data => {
        mealPlanId = data['id']
      })
      await MealPlanProduct.destroy({where: {mealplanId: mealPlanId}})
      await MealPlan.destroy({where: {orderId: order.id}})
      await order.destroy();

      return res.json({message: 'Успешно удалено'})
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
      const {chatId, fullname, phoneNumber, address, wish, user_id, typeOrderId} = req.body
      await Order.update({chatId: chatId, fullname: fullname, phoneNumber: phoneNumber, address: address, wish: wish, userId: user_id, typeOrderId: typeOrderId}, {where: {id: id}})

      return res.json({message: 'Обновлено!'});
    } catch (e) {
      console.log(e)
    }
  }
}

module.exports = new OrderController()