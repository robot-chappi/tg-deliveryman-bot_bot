const Router = require('express')
const categoryController = require('../controllers/categoryController')
const checkRoleMiddleware = require('../middleware/checkRoleMiddleware')
const router = new Router()

router.post('/', checkRoleMiddleware(['admin']), categoryController.createCategory)
router.get('/all', categoryController.getCategories)
router.get('/:id', categoryController.getCategory)
router.delete('/:id', checkRoleMiddleware(['admin']), categoryController.deleteCategory)
router.patch('/:id', checkRoleMiddleware(['admin']), categoryController.patchCategory)


module.exports = router