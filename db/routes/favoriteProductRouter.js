const Router = require('express')
const favoriteProductController = require('../controllers/favoriteProductController')
const authMiddleware = require('../middleware/authMiddleware')
const router = new Router()

router.post('/', authMiddleware, favoriteProductController.createFavoriteProducts)
router.get('/all/:id', authMiddleware, favoriteProductController.getFavoriteProducts)
router.delete('/all/:id', authMiddleware, favoriteProductController.deleteFavoriteProductsProducts)
router.delete('/', authMiddleware, favoriteProductController.deleteFavoriteProductsProduct)

module.exports = router