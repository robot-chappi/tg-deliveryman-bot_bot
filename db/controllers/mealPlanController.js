const ApiError = require('../error/ApiError')
const {MealPlan, MealPlanProduct, FavoriteProductProduct, FavoriteProduct} = require('../models/models')
const {createMealPlanProductsValidation} = require('../validations/mealPlanProducts/createMealPlanProductsValidation')
const {deleteMealPlanProductsValidation} = require('../validations/mealPlanProducts/deleteMealPlanProductsValidation')
const {createFavoriteProductsValidation} = require('../validations/favoriteProducts/createFavoriteProductsValidation')
const {deleteFavoriteProductsValidation} = require('../validations/favoriteProducts/deleteFavoriteProductsValidation')

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

  async createMealPlanProduct(req, res, next) {
    try {
      const {error} = createMealPlanProductsValidation(req.body);
      if(error) {
        return next(ApiError.badRequest('Не указаны правильно данные'))
      }
      const {meal_plan_id, products} = req.body
      console.log(products)
      return res.json(products)
      if (!await MealPlan.findOne({where: {orderId: meal_plan_id}})) return res.json('Ошибка');
      const mealPlanProduct = await MealPlanProduct.create({mealplanId: meal_plan_id, productId: product_id})
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

  async deleteMealPlanProduct(req, res) {
    try {
      const {error} = deleteFavoriteProductsValidation(req.body);
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
}

module.exports = new MealPlanController()