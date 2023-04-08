const ApiError = require('../error/ApiError')
const {MealPlan, MealPlanProduct, FavoriteIngredient, FavoriteIngredientIngredient, Order} = require('../models/models')
const {createMealPlanProductsValidation} = require('../validations/mealPlanProducts/createMealPlanProductsValidation')
const {deleteMealPlanProductsValidation} = require('../validations/mealPlanProducts/deleteMealPlanProductsValidation')
const {createMealPlanProductValidation} = require('../validations/mealPlanProducts/createMealPlanProductValidation')
const {updateOrderValidation} = require('../validations/order/updateOrderValidation')
const {where} = require('sequelize')
const {createOrderMealPlanProductsValidation} = require('../validations/mealPlanProducts/createOrderMealPlanProductsValidation')

class MealPlanController {
  async getMealPlanProducts(req, res) {
    try {
      const {id} = req.params
      const mealPlanProducts = await MealPlanProduct.findAll({where: {mealplanId: id}, include: ['mealplan', 'product']})
      return res.json(mealPlanProducts)
    } catch (e) {
      console.log(e)
    }
  }

  async getOrderMealPlanProducts(req, res) {
    try {
      const {orderId} = req.params
      const mealPlanItem = await MealPlan.findOne({where: {orderId: orderId}})
      const mealPlanProducts = await MealPlanProduct.findAll({where: {mealplanId: mealPlanItem.id}, include: ['mealplan', 'product']})

      let beautyPlan = {
        "Понедельник": [],
        "Вторник": [],
        "Среда": [],
        "Четверг": [],
        "Пятница": [],
        "Суббота": [],
        "Воскресенье": []
      }
      mealPlanProducts.forEach((i) => {
        if (i.slug_day === 'понедельник') {
          beautyPlan['Понедельник'].push(i.product)
        }
        if (i.slug_day === 'вторник') {
          beautyPlan['Вторник'].push(i.product)
        }
        if (i.slug_day === 'среда') {
          beautyPlan['Среда'].push(i.product)
        }
        if (i.slug_day === 'четверг') {
          beautyPlan['Четверг'].push(i.product)
        }
        if (i.slug_day === 'пятница') {
          beautyPlan['Пятница'].push(i.product)
        }
        if (i.slug_day === 'суббота') {
          beautyPlan['Суббота'].push(i.product)
        }
        if (i.slug_day === 'воскресенье') {
          beautyPlan['Воскресенье'].push(i.product)
        }
      })

      return res.json(beautyPlan)
    } catch (e) {
      console.log(e)
    }
  }

  async createMealPlanProducts(req, res, next) {
    try {
      const {error} = createMealPlanProductsValidation(req.body);
      if(error) {
        return next(ApiError.badRequest('Не указаны правильно данные'))
      }
      const {order_id, meal_plan_id, products} = req.body

      if (!await MealPlan.findOne({where: {orderId: order_id}})) return res.json('Ошибка');

      for (let productItems in products) {
        for(let product in products[productItems]) {
          if (productItems === 'Понедельник') {
            await MealPlanProduct.create({name_day: productItems, slug_day: productItems.toLowerCase(), mealplanId: meal_plan_id, productId: products[productItems][product]['id']})
          }
          if (productItems === 'Вторник') {
            await MealPlanProduct.create({name_day: productItems, slug_day: productItems.toLowerCase(), mealplanId: meal_plan_id, productId: products[productItems][product]['id']})
          }
          if (productItems === 'Среда') {
            await MealPlanProduct.create({name_day: productItems, slug_day: productItems.toLowerCase(), mealplanId: meal_plan_id, productId: products[productItems][product]['id']})
          }
          if (productItems === 'Четверг') {
            await MealPlanProduct.create({name_day: productItems, slug_day: productItems.toLowerCase(), mealplanId: meal_plan_id, productId: products[productItems][product]['id']})
          }
          if (productItems === 'Пятница') {
            await MealPlanProduct.create({name_day: productItems, slug_day: productItems.toLowerCase(), mealplanId: meal_plan_id, productId: products[productItems][product]['id']})
          }
          if (productItems === 'Суббота') {
            await MealPlanProduct.create({name_day: productItems, slug_day: productItems.toLowerCase(), mealplanId: meal_plan_id, productId: products[productItems][product]['id']})
          }
          if (productItems === 'Воскресенье') {
            await MealPlanProduct.create({name_day: productItems, slug_day: productItems.toLowerCase(), mealplanId: meal_plan_id, productId: products[productItems][product]['id']})
          }
        }
      }

      return res.json('Готово');
    } catch (e) {
      console.log(e)
    }
  }

  async createOrderMealPlanProducts(req, res, next) {
    try {
      const {error} = createOrderMealPlanProductsValidation(req.body);
      if(error) {
        return next(ApiError.badRequest('Не указаны правильно данные'))
      }

      const {order_id, meal_plan_id, price, products} = req.body
      if (!await MealPlan.findOne({where: {orderId: order_id}})) return res.json('Ошибка');
      // return  console.log(products)
      for (let productItems in products) {
        for(let product in products[productItems]) {
          if (productItems === 'Понедельник') {
            await MealPlanProduct.create({name_day: productItems, slug_day: productItems.toLowerCase(), mealplanId: meal_plan_id, productId: products[productItems][product]['id']})
          }
          if (productItems === 'Вторник') {
            await MealPlanProduct.create({name_day: productItems, slug_day: productItems.toLowerCase(), mealplanId: meal_plan_id, productId: products[productItems][product]['id']})
          }
          if (productItems === 'Среда') {
            await MealPlanProduct.create({name_day: productItems, slug_day: productItems.toLowerCase(), mealplanId: meal_plan_id, productId: products[productItems][product]['id']})
          }
          if (productItems === 'Четверг') {
            await MealPlanProduct.create({name_day: productItems, slug_day: productItems.toLowerCase(), mealplanId: meal_plan_id, productId: products[productItems][product]['id']})
          }
          if (productItems === 'Пятница') {
            await MealPlanProduct.create({name_day: productItems, slug_day: productItems.toLowerCase(), mealplanId: meal_plan_id, productId: products[productItems][product]['id']})
          }
          if (productItems === 'Суббота') {
            await MealPlanProduct.create({name_day: productItems, slug_day: productItems.toLowerCase(), mealplanId: meal_plan_id, productId: products[productItems][product]['id']})
          }
          if (productItems === 'Воскресенье') {
            await MealPlanProduct.create({name_day: productItems, slug_day: productItems.toLowerCase(), mealplanId: meal_plan_id, productId: products[productItems][product]['id']})
          }
        }
      }

      if (price !== null) await MealPlan.update({price: Number(price)}, {where: {orderId: order_id}})

      return res.json('Готово');
    } catch (e) {
      console.log(e)
    }
  }

  async createMealPlanProduct(req, res, next) {
    try {
      const {error} = createMealPlanProductValidation(req.body);
      if(error) {
        return next(ApiError.badRequest('Не указаны правильно данные'))
      }
      const {meal_plan_id, product_id, name_day, slug_day} = req.body

      if (!await MealPlan.findOne({where: {orderId: meal_plan_id}})) return res.json('Ошибка');

      const mealPlanProduct = await MealPlanProduct.create({name_day: name_day, slug_day: slug_day, mealplanId: meal_plan_id, productId: product_id})

      return res.json(mealPlanProduct);
    } catch (e) {
      console.log(e)
    }
  }

  async deleteMealPlanProducts(req, res) {
    try {
      const {id} = req.params
      if (!await MealPlan.findOne({where: {orderId: id}})) return res.json('Ошибка');
      await MealPlanProduct.destroy({where: {mealplanId: id}})
      return res.json({message: 'Успешно удалено'})
    } catch (e) {
      console.log(e)
    }
  }

  async deleteMealPlanProduct(req, res, next) {
    try {
      const {error} = deleteMealPlanProductsValidation(req.body);
      if(error) {
        return next(ApiError.badRequest('Не указаны правильно данные'))
      }
      const {meal_plan_id, meal_plan_product_id} = req.body
      if (!await MealPlanProduct.findOne({where: {id: meal_plan_product_id}})) return res.json('Ошибка');

      await MealPlanProduct.destroy({where: {id: meal_plan_product_id, mealplanId: meal_plan_id}})
      return res.json({message: 'Успешно удалено'})
    } catch (e) {
      console.log(e)
    }
  }

  async patchMealPlanPrice(req, res) {
    try {
      const {id} = req.params
      const {price} = req.body
      await MealPlan.update({price: price}, {where: {id: id}})

      return res.json({message: 'Обновлено!'});
    } catch (e) {
      console.log(e)
    }
  }
}

module.exports = new MealPlanController()