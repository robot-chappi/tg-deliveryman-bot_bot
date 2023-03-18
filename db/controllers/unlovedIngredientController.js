const ApiError = require('../error/ApiError')
const {UnlovedIngredientIngredient, UnlovedIngredient} = require('../models/models')
const {createUnlovedIngredientsValidation} = require('../validations/unlovedIngredients/createUnlovedIngredientsValidation')
const {deleteUnlovedIngredientsValidation} = require('../validations/unlovedIngredients/deleteUnlovedIngredientsValidation')

class UnlovedIngredientController {
  async getUnlovedIngredients(req, res) {
    try {
      const {id} = req.params
      const unlovedIngredientIngredients = await UnlovedIngredientIngredient.findAll({where: {unlovedIngredientId: id}, include: ['unloved_ingredient', 'ingredient']})
      return res.json(unlovedIngredientIngredients)
    } catch (e) {
      console.log(e)
    }
  }

  async createUnlovedIngredients(req, res, next) {
    try {
      const {error} = createUnlovedIngredientsValidation(req.body);
      if(error) {
        return next(ApiError.badRequest('Не указаны правильно данные'))
      }
      const {unloved_ingredient_id, ingredient_id} = req.body
      if (!await UnlovedIngredient.findOne({where: {userId: unloved_ingredient_id}})) return res.json('Ошибка');
      const unlovedIngredientsIngredient = await UnlovedIngredientIngredient.create({unlovedIngredientId: unloved_ingredient_id, ingredientId: ingredient_id})
      return res.json(unlovedIngredientsIngredient);
    } catch (e) {
      console.log(e)
    }
  }

  async deleteUnlovedIngredientsIngredients(req, res) {
    try {
      const {id} = req.params
      if (!await UnlovedIngredient.findOne({where: {userId: id}})) return res.json('Ошибка');
      await UnlovedIngredientIngredient.destroy({where: {unlovedIngredientId: id}})
      return res.json({message: 'Успешно удалено'})
    } catch (e) {
      console.log(e)
    }
  }

  async deleteUnlovedIngredientsIngredient(req, res, next) {
    try {
      const {error} = deleteUnlovedIngredientsValidation(req.body);
      if(error) {
        return next(ApiError.badRequest('Не указаны правильно данные'))
      }
      const {unloved_ingredient_id, unloved_ingredient_ingredient_id} = req.body
      if (!await UnlovedIngredientIngredient.findOne({where: {id: unloved_ingredient_ingredient_id}})) return res.json('Ошибка');

      await UnlovedIngredientIngredient.destroy({where: {id: unloved_ingredient_ingredient_id, unlovedIngredientId: unloved_ingredient_id}})
      return res.json({message: 'Успешно удалено'})
    } catch (e) {
      console.log(e)
    }
  }
}

module.exports = new UnlovedIngredientController()