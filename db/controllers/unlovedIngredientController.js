const ApiError = require('../error/ApiError')
const {UnlovedIngredientIngredient, UnlovedIngredient, User, FavoriteIngredientIngredient} = require('../models/models')
const {createUnlovedIngredientsValidation} = require('../validations/unlovedIngredients/createUnlovedIngredientsValidation')

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

  async getUserUnlovedIngredients(req, res) {
    try {
      const {userId} = req.params
      const unlovedIngredientItem = await UnlovedIngredient.findOne({where: {userId: userId}})
      const unlovedIngredientIngredients = await UnlovedIngredientIngredient.findAll({where: {unlovedIngredientId: unlovedIngredientItem.id}, include: ['unloved_ingredient', 'ingredient']})
      return res.json(unlovedIngredientIngredients)
    } catch (e) {
      console.log(e)
    }
  }

  async getUserChatUnlovedIngredients(req, res) {
    try {
      const {chatId} = req.params
      const user = await User.findOne({where: {chatId: chatId}})
      const unlovedIngredientItem = await UnlovedIngredient.findOne({where: {userId: user.id}})
      const unlovedIngredientIngredients = await UnlovedIngredientIngredient.findAll({where: {unlovedIngredientId: unlovedIngredientItem.id}, include: ['unloved_ingredient', 'ingredient']})
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
      const {favorite_ingredient_id, unloved_ingredient_id, ingredient_id} = req.body
      const favoriteIngIng = await FavoriteIngredientIngredient.findOne({where: {favoriteIngredientId: favorite_ingredient_id, ingredientId: ingredient_id}, include: ['favorite_ingredient', 'ingredient']});
      const unlovedIngIng = await UnlovedIngredientIngredient.findOne({where: {unlovedIngredientId: unloved_ingredient_id, ingredientId: ingredient_id}, include: ['unloved_ingredient', 'ingredient']});
      if (!await UnlovedIngredient.findOne({where: {userId: unloved_ingredient_id}})) return res.json({message: 'Ошибка', error: true});
      if (favoriteIngIng) {
        await favoriteIngIng.destroy()
      }
      if (unlovedIngIng) {
        let name = unlovedIngIng.ingredient.title
        await unlovedIngIng.destroy()
        return res.json({message: `${name} - удален из Нелюбимого`})
      }
      await UnlovedIngredientIngredient.create({unlovedIngredientId: unloved_ingredient_id, ingredientId: ingredient_id})
      return res.json({message: 'Добавлен в Нелюбимое'});
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

  async deleteUnlovedIngredientsIngredient(req, res) {
    try {
      const {unloved_ingredient_id, unloved_ingredient_ingredient_id} = req.query
      if (!await UnlovedIngredientIngredient.findOne({where: {id: unloved_ingredient_ingredient_id}})) return res.json('Ошибка');

      await UnlovedIngredientIngredient.destroy({where: {id: unloved_ingredient_ingredient_id, unlovedIngredientId: unloved_ingredient_id}})
      return res.json({message: 'Успешно удалено'})
    } catch (e) {
      console.log(e)
    }
  }
}

module.exports = new UnlovedIngredientController()