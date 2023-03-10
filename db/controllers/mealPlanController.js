const ApiError = require('../error/ApiError')
const {MealPlan, Ingredient} = require('../models/models')
const {createMealPlanValidation} = require('../validations/mealPlan/createMealPlanValidation')

class MealPlanController {
  async getMealPlans(req, res) {
    try {
      const mealPlans = await MealPlan.findAll();
      return res.json(mealPlans)
    } catch (e) {
      console.log(e)
    }
  }

  async getMealPlan(req, res) {
    try {
      const {id} = req.params
      const mealPlan = await mealPlan.findOne({where: {id: id}})
      return res.json(mealPlan)
    } catch (e) {
      console.log(e)
    }
  }

  async createMealPlan(req, res, next) {
    // Доработать
    try {
      const {error} = createMealPlanValidation(req.body);
      if(error) {
        return next(ApiError.badRequest('Что-то пошло не так с данными...'))
      }
      const {monday, tuesday, wednesday, thursday, friday, saturday, sunday} = req.body
      const mealPlan = await MealPlan.create({monday, tuesday, wednesday, thursday, friday, saturday, sunday})
      return res.json(mealPlan);
    } catch (e) {
      console.log(e)
    }
  }

  async deleteMealPlan(req, res) {
    try {
      const {id} = req.params
      await MealPlan.destroy({where: {id: id}})
      return res.json({message: 'Успешно удалено'})
    } catch (e) {
      console.log(e)
    }
  }
}

module.exports = new MealPlanController()