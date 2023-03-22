const Router = require('express')
const orderController = require('../controllers/orderController')
const authMiddleware = require('../middleware/authMiddleware')
const checkRoleMiddleware = require('../middleware/checkRoleMiddleware')
const router = new Router()

router.post('/', authMiddleware, orderController.createOrder)
router.post('/complete', checkRoleMiddleware(['admin']), orderController.completeUncompleteOrder)
router.get('/all', checkRoleMiddleware(['admin']), orderController.getOrders)
router.get('/:id', authMiddleware, orderController.getOrder)
router.patch('/:id', checkRoleMiddleware(['admin']), orderController.patchOrder)
router.delete('/:id', checkRoleMiddleware(['admin']), orderController.deleteOrder)


module.exports = router