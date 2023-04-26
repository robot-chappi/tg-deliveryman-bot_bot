const Router = require('express')
const typeController = require('../controllers/typeController')
const checkRoleMiddleware = require('../middleware/checkRoleMiddleware')
const router = new Router()

router.post('/', checkRoleMiddleware(['admin', 'analyst', 'copywriter']), typeController.createType)
router.get('/all', typeController.getTypes)
router.get('/:id', typeController.getType)
router.delete('/:id', checkRoleMiddleware(['admin', 'analyst', 'copywriter']), typeController.deleteType)
router.patch('/:id', checkRoleMiddleware(['admin', 'analyst', 'copywriter']), typeController.patchType)


module.exports = router