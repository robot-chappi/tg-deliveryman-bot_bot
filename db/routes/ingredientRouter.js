const Router = require('express')
const ingredientController = require('../controllers/ingredientController')
const checkRoleMiddleware = require('../middleware/checkRoleMiddleware')
const router = new Router()

router.post('/', checkRoleMiddleware(['admin', 'analyst', 'copywriter']), ingredientController.createIngredient)
router.get('/all', ingredientController.getIngredients)
router.get('/:id', ingredientController.getIngredient)
router.delete('/:id', checkRoleMiddleware(['admin', 'analyst', 'copywriter']), ingredientController.deleteIngredient)
router.patch('/:id', checkRoleMiddleware(['admin', 'analyst', 'copywriter']), ingredientController.patchIngredient)


module.exports = router