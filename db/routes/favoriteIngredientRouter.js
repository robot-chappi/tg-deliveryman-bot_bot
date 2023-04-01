const Router = require('express')
const favoriteIngredientController = require('../controllers/favoriteIngredientController')
const authMiddleware = require('../middleware/authMiddleware')
const router = new Router()

router.post('/', authMiddleware, favoriteIngredientController.createFavoriteIngredients)
router.get('/all/:id', authMiddleware, favoriteIngredientController.getFavoriteIngredients)
router.get('/user/all/:userId', favoriteIngredientController.getUserFavoriteIngredients)
router.get('/user/all/chat/:chatId', favoriteIngredientController.getUserChatFavoriteIngredients)
router.delete('/all/:id', authMiddleware, favoriteIngredientController.deleteFavoriteIngredientsIngredients)
router.delete('/', authMiddleware, favoriteIngredientController.deleteFavoriteIngredientsIngredient)

module.exports = router