const Router = require('express')
const roleController = require('../controllers/roleController')
const checkRoleMiddleware = require('../middleware/checkRoleMiddleware')
const router = new Router()

router.post('/', checkRoleMiddleware(['admin']), roleController.createRole)
router.get('/all', roleController.getRoles)
router.get('/:id', checkRoleMiddleware(['admin']), roleController.getRole)
router.delete('/:id', checkRoleMiddleware(['admin']), roleController.deleteRole)
router.patch('/:id', checkRoleMiddleware(['admin']), roleController.patchRole)


module.exports = router