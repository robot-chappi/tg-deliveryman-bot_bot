const Router = require('express')
const ingredientController = require('../controllers/ingredientController')
const router = new Router()

router.post('/', ingredientController.createIngredient)
router.get('/all', ingredientController.getIngredients)
router.get('/:id', ingredientController.getIngredient)
router.delete('/:id', ingredientController.deleteIngredient)
router.patch('/:id', ingredientController.patchIngredient)


module.exports = router