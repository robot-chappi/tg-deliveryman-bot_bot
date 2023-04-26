const Router = require('express')
const orderController = require('../controllers/orderController')
const authMiddleware = require('../middleware/authMiddleware')
const checkRoleMiddleware = require('../middleware/checkRoleMiddleware')
const router = new Router()

router.post('/', authMiddleware, orderController.createOrder)
router.post('/complete/:id', checkRoleMiddleware(['admin', 'analyst', 'copywriter']), orderController.completeUncompleteOrder)
router.post('/pay/:id', checkRoleMiddleware(['admin', 'analyst', 'copywriter']), orderController.payUnpayOrder)
router.get('/all', checkRoleMiddleware(['admin', 'analyst', 'copywriter']), orderController.getOrders)
router.get('/all/completed', checkRoleMiddleware(['admin', 'analyst', 'copywriter']), orderController.getCompletedOrders)
router.get('/user/:chatId', orderController.getUserOrder)
router.get('/user/all/:chatId', orderController.getAllUserOrders)
router.get('/:id', checkRoleMiddleware(['admin', 'analyst', 'copywriter']), orderController.getOrder)
router.patch('/:id', checkRoleMiddleware(['admin', 'analyst', 'copywriter']), orderController.patchOrder)
router.delete('/user/:chatId', orderController.deleteUserOrder)
router.delete('/user/all/:chatId', orderController.deleteUserOrders)
router.delete('/:id', checkRoleMiddleware(['admin', 'analyst', 'copywriter']), orderController.deleteOrder)


module.exports = router