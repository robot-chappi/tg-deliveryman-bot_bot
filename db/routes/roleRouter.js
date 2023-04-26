const Router = require('express')
const roleController = require('../controllers/roleController')
const checkRoleMiddleware = require('../middleware/checkRoleMiddleware')
const router = new Router()

router.post('/', checkRoleMiddleware(['admin', 'analyst', 'copywriter']), roleController.createRole)
router.get('/all', roleController.getRoles)
router.get('/:id', checkRoleMiddleware(['admin', 'analyst', 'copywriter']), roleController.getRole)
router.delete('/:id', checkRoleMiddleware(['admin', 'analyst', 'copywriter']), roleController.deleteRole)
router.patch('/:id', checkRoleMiddleware(['admin', 'analyst', 'copywriter']), roleController.patchRole)


module.exports = router