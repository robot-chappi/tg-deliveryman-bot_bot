const Router = require('express')
const unlovedIngredientController = require('../controllers/unlovedIngredientController')
const authMiddleware = require('../middleware/authMiddleware')
const router = new Router()

router.post('/', authMiddleware, unlovedIngredientController.createUnlovedIngredients)
router.get('/all/:id', authMiddleware, unlovedIngredientController.getUnlovedIngredients)
router.delete('/all/:id', authMiddleware, unlovedIngredientController.deleteUnlovedIngredientsIngredients)
router.delete('/', authMiddleware, unlovedIngredientController.deleteUnlovedIngredientsIngredient)

module.exports = router