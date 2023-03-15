const Router = require('express')
const favoriteIngredientController = require('../controllers/favoriteIngredientController')
const router = new Router()

router.post('/', favoriteIngredientController.createFavoriteIngredients)
router.get('/all/:id', favoriteIngredientController.getFavoriteIngredients)
router.delete('/all/:id', favoriteIngredientController.deleteFavoriteIngredientsIngredients)
router.delete('/', favoriteIngredientController.deleteFavoriteIngredientsIngredient)

module.exports = router