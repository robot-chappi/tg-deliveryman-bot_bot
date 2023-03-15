const ApiError = require('../error/ApiError')
const {FavoriteIngredientIngredient} = require('../models/models')
const {createFavoriteIngredientsValidation} = require('../validations/favoriteIngredients/createFavoriteIngredientsValidation')
const {deleteFavoriteIngredientsValidation} = require('../validations/favoriteIngredients/deleteFavoriteIngredientsValidation')

class FavoriteIngredientController {
  async getFavoriteIngredients(req, res) {
    try {
      const {id} = req.params
      const favoriteIngredientIngredients = await FavoriteIngredientIngredient.findAll({where: {favoriteIngredientId: id}, include: ['favorite_ingredient', 'ingredient']})
      return res.json(favoriteIngredientIngredients)
    } catch (e) {
      console.log(e)
    }
  }

  async createFavoriteIngredients(req, res, next) {
    try {
      const {error} = createFavoriteIngredientsValidation(req.body);
      if(error) {
        return next(ApiError.badRequest('Не указаны правильно данные'))
      }
      const {favorite_ingredient_id, ingredient_id} = req.body
      const favoriteIngredientsIngredient = await FavoriteIngredientIngredient.create({favoriteIngredientId: favorite_ingredient_id, ingredientId: ingredient_id})
      return res.json(favoriteIngredientsIngredient);
    } catch (e) {
      console.log(e)
    }
  }

  async deleteFavoriteIngredientsIngredients(req, res) {
    try {
      const {id} = req.params
      await FavoriteIngredientIngredient.destroy({where: {favoriteIngredientId: id}})
      return res.json({message: 'Успешно удалено'})
    } catch (e) {
      console.log(e)
    }
  }

  async deleteFavoriteIngredientsIngredient(req, res, next) {
    try {
      const {error} = deleteFavoriteIngredientsValidation(req.body);
      if(error) {
        return next(ApiError.badRequest('Не указаны правильно данные'))
      }
      const {favorite_ingredient_id, favorite_ingredient_ingredient_id} = req.body

      await FavoriteIngredientIngredient.destroy({where: {id: favorite_ingredient_ingredient_id, favoriteIngredientId: favorite_ingredient_id}})
      return res.json({message: 'Успешно удалено'})
    } catch (e) {
      console.log(e)
    }
  }
}

module.exports = new FavoriteIngredientController()