const ApiError = require('../error/ApiError')
const {FavoriteProduct, FavoriteProductProduct} = require('../models/models')
const {createFavoriteProductsValidation} = require('../validations/favoriteProducts/createFavoriteProductsValidation')
const {deleteFavoriteProductsValidation} = require('../validations/favoriteProducts/deleteFavoriteProductsValidation')

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

  async createFavoriteProducts(req, res, next) {
    try {
      const {error} = createFavoriteProductsValidation(req.body);
      if(error) {
        return next(ApiError.badRequest('Не указаны правильно данные'))
      }
      const {favorite_product_id, product_id} = req.body
      const favoriteProductsProduct = await FavoriteProductProduct.create({favoriteProductId: favorite_product_id, productId: product_id})
      return res.json(favoriteProductsProduct);
    } catch (e) {
      console.log(e)
    }
  }

  async deleteFavoriteProductsProducts(req, res) {
    try {
      const {id} = req.params
      await FavoriteProductProduct.destroy({where: {favoriteProductId: id}})
      return res.json({message: 'Успешно удалено'})
    } catch (e) {
      console.log(e)
    }
  }

  async deleteFavoriteProductsProduct(req, res, next) {
    try {
      const {error} = deleteFavoriteProductsValidation(req.body);
      if(error) {
        return next(ApiError.badRequest('Не указаны правильно данные'))
      }
      const {favorite_product_id, favorite_product_product_id} = req.body

      await FavoriteProductProduct.destroy({where: {id: favorite_product_product_id, favoriteProductId: favorite_product_id}})
      return res.json({message: 'Успешно удалено'})
    } catch (e) {
      console.log(e)
    }
  }
}

module.exports = new FavoriteProductController()