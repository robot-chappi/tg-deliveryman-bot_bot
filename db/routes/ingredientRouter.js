const Router = require('express')
const ingredientController = require('../controllers/ingredientController')
const checkRoleMiddleware = require('../middleware/checkRoleMiddleware')
const router = new Router()

router.post('/', checkRoleMiddleware(['admin']), ingredientController.createIngredient)
router.get('/all', ingredientController.getIngredients)
router.get('/:id', ingredientController.getIngredient)
router.delete('/:id', checkRoleMiddleware(['admin']), ingredientController.deleteIngredient)
router.patch('/:id', checkRoleMiddleware(['admin']), ingredientController.patchIngredient)


module.exports = router