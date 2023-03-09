const Router = require('express')
const productController = require('../controllers/productController')
const router = new Router()

router.post('/', productController.createProduct)
router.get('/all', productController.getProducts)
router.get('/:id', productController.getProduct)
router.delete('/:id', productController.deleteProduct)
router.patch('/:id', productController.patchProduct)


module.exports = router