const Router = require('express')
const privilegeController = require('../controllers/privilegeController')
const checkRoleMiddleware = require('../middleware/checkRoleMiddleware')
const router = new Router()

router.post('/', checkRoleMiddleware(['admin', 'analyst', 'copywriter']), privilegeController.createPrivilege)
router.get('/all', privilegeController.getPrivileges)
router.get('/:id', privilegeController.getPrivilege)
router.delete('/:id', checkRoleMiddleware(['admin', 'analyst', 'copywriter']), privilegeController.deletePrivilege)
router.patch('/:id', checkRoleMiddleware(['admin', 'analyst', 'copywriter']), privilegeController.patchPrivilege)


module.exports = router