const ApiError = require('../error/ApiError')
const {Ingredient, Category} = require('../models/models')
const {createIngredientValidation} = require('../validations/ingredient/createIngredientValidation')
const {updateIngredientValidation} = require('../validations/ingredient/updateIngredientValidation')

class IngredientController {
  async getIngredients(req, res) {
    try {
      const ingredients = await Ingredient.findAll();
      return res.json(ingredients)
    } catch (e) {
      console.log(e)
    }
  }

  async getIngredient(req, res) {
    try {
      const {id} = req.params
      const ingredient = await Ingredient.findOne({where: {id: id}})
      return res.json(ingredient)
    } catch (e) {
      console.log(e)
    }
  }

  async createIngredient(req, res, next) {
    try {
      const {error} = createIngredientValidation(req.body);
      if(error) {
        return next(ApiError.badRequest('Не введено название ингридиент'))
      }
      const {title} = req.body
      const ingredient = await Ingredient.create({title})
      return res.json(ingredient);
    } catch (e) {
      console.log(e)
    }
  }

  async deleteIngredient(req, res) {
    try {
      const {id} = req.params
      await Ingredient.destroy({where: {id: id}})
      return res.json({message: 'Успешно удалено'})
    } catch (e) {
      console.log(e)
    }
  }

  async patchIngredient(req, res, next) {
    try {
      const {error} = updateIngredientValidation(req.body);
      if(error) {
        return next(ApiError.badRequest('Не введено название ингридиента'))
      }

      const {id} = req.params
      const {title} = req.body

      await Ingredient.update({title: title}, {where: {id: id}})
      return res.json({message: 'Обновлено!'});
    } catch (e) {
      console.log(e)
    }
  }
}

module.exports = new IngredientController()