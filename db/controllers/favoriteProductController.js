const ApiError = require('../error/ApiError')
const {FavoriteProduct, FavoriteProductProduct, User, Product, Ingredient, IngredientProduct} = require('../models/models')
const {createFavoriteProductsValidation} = require('../validations/favoriteProducts/createFavoriteProductsValidation')

class FavoriteProductController {
  async getFavoriteProducts(req, res) {
    try {
      const {id} = req.params
      const favoriteProductProducts = await FavoriteProductProduct.findAll({where: {favoriteProductId: id}, include: ['favorite_product', 'product']})
      return res.json(favoriteProductProducts)
    } catch (e) {
      console.log(e)
    }
  }

  async getUserFavoriteProducts(req, res) {
    try {
      const {userId} = req.params
      const favoriteProductItem = await FavoriteProduct.findOne({where: {userId: userId}})
      const favoriteProductProducts = await FavoriteProductProduct.findAll({where: {favoriteProductId: favoriteProductItem.id}, include: ['favorite_product', 'product']})
      return res.json(favoriteProductProducts)
    } catch (e) {
      console.log(e)
    }
  }

  async getUserChatFavoriteProducts(req, res) {
    try {
      const {chatId} = req.params
      const user = await User.findOne({where: {chatId: chatId}})
      const favoriteProductItem = await FavoriteProduct.findOne({where: {userId: user.id}})
      const favoriteProductProducts = await FavoriteProductProduct.findAll({where: {favoriteProductId: favoriteProductItem.id}, include: ['favorite_product', {model: Product, include: ["category", "type", {model: Ingredient, through: IngredientProduct}]}]})
      return res.json(favoriteProductProducts)
    } catch (e) {
      console.log(e)
    }
  }

  async createFavoriteProducts(req, res, next) {
    try {
      const {error} = createFavoriteProductsValidation(req.body);
      if(error) {
        return next(ApiError.badRequest('Не указаны правильно данные'))
      }
      const {favorite_product_id, product_id} = req.body
      if (!await FavoriteProduct.findOne({where: {userId: favorite_product_id}})) return res.json('Ошибка');
      const favoriteProductsProduct = await FavoriteProductProduct.create({favoriteProductId: favorite_product_id, productId: product_id})
      return res.json(favoriteProductsProduct);
    } catch (e) {
      console.log(e)
    }
  }

  async deleteFavoriteProductsProducts(req, res) {
    try {
      const {id} = req.params
      // changed
      const favoriteProduct = await FavoriteProduct.findOne({where: {userId: id}})
      if (!favoriteProduct) return res.json('Ошибка');
      await FavoriteProductProduct.destroy({where: {favoriteProductId: favoriteProduct.id}})
      return res.json({message: 'Успешно удалено'})
    } catch (e) {
      console.log(e)
    }
  }

  async deleteFavoriteProductsProduct(req, res) {
    try {
      const {favorite_product_id, favorite_product_product_id} = req.query

      if (!await FavoriteProductProduct.findOne({where: {id: favorite_product_product_id}})) return res.json('Ошибка');

      await FavoriteProductProduct.destroy({where: {id: favorite_product_product_id, favoriteProductId: favorite_product_id}})
      return res.json({message: 'Успешно удалено'})
    } catch (e) {
      console.log(e)
    }
  }
}

module.exports = new FavoriteProductController()