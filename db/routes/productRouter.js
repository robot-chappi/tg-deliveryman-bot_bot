const Router = require('express')
const productController = require('../controllers/productController')
const checkRoleMiddleware = require('../middleware/checkRoleMiddleware')
const router = new Router()

router.post('/', checkRoleMiddleware(['admin', 'analyst', 'copywriter']), productController.createProduct)
router.get('/pagination', productController.paginationProduct)
router.get('/all', productController.getProducts)
router.get('/all/ingredients', productController.getProductsWithIngredients)
router.get('/ingredient/:id', productController.getProductWithIngredients)
router.get('/:id', productController.getProduct)
router.delete('/:id', checkRoleMiddleware(['admin', 'analyst', 'copywriter']), productController.deleteProduct)
router.patch('/:id', checkRoleMiddleware(['admin', 'analyst', 'copywriter']), productController.patchProduct)

module.exports = router