const ApiError = require('../error/ApiError')
const {FavoriteIngredientIngredient, FavoriteIngredient, User, UnlovedIngredientIngredient} = require('../models/models')
const {createFavoriteIngredientsValidation} = require('../validations/favoriteIngredients/createFavoriteIngredientsValidation')

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

  async getUserFavoriteIngredients(req, res) {
    try {
      const {userId} = req.params
      const favoriteIngredientItem = await FavoriteIngredient.findOne({where: {userId: userId}})
      const favoriteIngredientIngredients = await FavoriteIngredientIngredient.findAll({where: {favoriteIngredientId: favoriteIngredientItem.id}, include: ['favorite_ingredient', 'ingredient']})
      return res.json(favoriteIngredientIngredients)
    } catch (e) {
      console.log(e)
    }
  }

  async getUserChatFavoriteIngredients(req, res) {
    try {
      const {chatId} = req.params
      const user = await User.findOne({where: {chatId: chatId}})
      const favoriteIngredientItem = await FavoriteIngredient.findOne({where: {userId: user.id}})
      const favoriteIngredientIngredients = await FavoriteIngredientIngredient.findAll({where: {favoriteIngredientId: favoriteIngredientItem.id}, include: ['favorite_ingredient', 'ingredient']})
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
      const {unloved_ingredient_id, favorite_ingredient_id, ingredient_id} = req.body
      const unlovedIngIng = await UnlovedIngredientIngredient.findOne({where: {unlovedIngredientId: unloved_ingredient_id, ingredientId: ingredient_id}, include: ['unloved_ingredient', 'ingredient']})
      const favoriteIngIng = await FavoriteIngredientIngredient.findOne({where: {favoriteIngredientId: favorite_ingredient_id, ingredientId: ingredient_id}, include: ['favorite_ingredient', 'ingredient']})
      if (!await FavoriteIngredient.findOne({where: {userId: favorite_ingredient_id}})) return res.json({message: 'Ошибка', error: true});
      if (unlovedIngIng) {
        await unlovedIngIng.destroy()
      }
      if (favoriteIngIng) {
        let name = favoriteIngIng.ingredient.title;
        await favoriteIngIng.destroy()
        return res.json({message: `${name} - удален из Любимого`})
      }
      await FavoriteIngredientIngredient.create({favoriteIngredientId: favorite_ingredient_id, ingredientId: ingredient_id})
      return res.json({message: 'Добавлен в Любимое'});
    } catch (e) {
      console.log(e)
    }
  }

  async deleteFavoriteIngredientsIngredients(req, res) {
    try {
      const {id} = req.params
      if (!await FavoriteIngredient.findOne({where: {userId: id}})) return res.json('Ошибка');
      await FavoriteIngredientIngredient.destroy({where: {favoriteIngredientId: id}})
      return res.json({message: 'Успешно удалено'})
    } catch (e) {
      console.log(e)
    }
  }

  async deleteFavoriteIngredientsIngredient(req, res, next) {
    try {
      const {favorite_ingredient_id, favorite_ingredient_ingredient_id} = req.query
      if (!await FavoriteIngredientIngredient.findOne({where: {id: favorite_ingredient_ingredient_id}})) return res.json('Ошибка');

      await FavoriteIngredientIngredient.destroy({where: {id: favorite_ingredient_ingredient_id, favoriteIngredientId: favorite_ingredient_id}})
      return res.json({message: 'Успешно удалено'})
    } catch (e) {
      console.log(e)
    }
  }
}

module.exports = new FavoriteIngredientController()