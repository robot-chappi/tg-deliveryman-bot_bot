const Router = require('express')
const favoriteProductController = require('../controllers/favoriteProductController')
const router = new Router()

router.post('/', favoriteProductController.createFavoriteProducts)
router.get('/all/:id', favoriteProductController.getFavoriteProducts)
router.delete('/all/:id', favoriteProductController.deleteFavoriteProductsProducts)
router.delete('/', favoriteProductController.deleteFavoriteProductsProduct)

module.exports = router