const Router = require('express')
const unlovedIngredientController = require('../controllers/unlovedIngredientController')
const router = new Router()

router.post('/', unlovedIngredientController.createUnlovedIngredients)
router.get('/all/:id', unlovedIngredientController.getUnlovedIngredients)
router.delete('/all/:id', unlovedIngredientController.deleteUnlovedIngredientsIngredients)
router.delete('/', unlovedIngredientController.deleteUnlovedIngredientsIngredient)

module.exports = router