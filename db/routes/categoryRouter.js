const Router = require('express')
const categoryController = require('../controllers/categoryController')
const router = new Router()

router.post('/', categoryController.createCategory)
router.get('/all', categoryController.getCategories)
router.get('/:id', categoryController.getCategory)
router.delete('/:id', categoryController.deleteCategory)
router.patch('/:id', categoryController.patchCategory)


module.exports = router