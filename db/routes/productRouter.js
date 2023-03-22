const Router = require('express')
const productController = require('../controllers/productController')
const checkRoleMiddleware = require('../middleware/checkRoleMiddleware')
const router = new Router()

router.post('/', checkRoleMiddleware(['admin']), productController.createProduct)
router.get('/pagination', productController.paginationProduct)
router.get('/all', productController.getProducts)
router.get('/:id', productController.getProduct)
router.delete('/:id', checkRoleMiddleware(['admin']), productController.deleteProduct)
router.patch('/:id', checkRoleMiddleware(['admin']), productController.patchProduct)

module.exports = router