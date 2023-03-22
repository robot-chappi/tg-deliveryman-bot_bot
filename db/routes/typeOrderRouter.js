const Router = require('express')
const typeOrderController = require('../controllers/typeOrderController')
const checkRoleMiddleware = require('../middleware/checkRoleMiddleware')
const router = new Router()

router.post('/', checkRoleMiddleware(['admin']), typeOrderController.createTypeOrder)
router.get('/all', typeOrderController.getTypesOrder)
router.get('/:id', typeOrderController.getTypeOrder)
router.delete('/:id', checkRoleMiddleware(['admin']), typeOrderController.deleteTypeOrder)
router.patch('/:id', checkRoleMiddleware(['admin']), typeOrderController.patchTypeOrder)


module.exports = router