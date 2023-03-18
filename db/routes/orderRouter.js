const Router = require('express')
const orderController = require('../controllers/orderController')
const router = new Router()

router.post('/', orderController.createOrder)
router.post('/complete', orderController.completeUncompleteOrder)
router.get('/all', orderController.getOrders)
router.get('/:id', orderController.getOrder)
router.patch('/:id', orderController.patchOrder)
router.delete('/:id', orderController.deleteOrder)


module.exports = router