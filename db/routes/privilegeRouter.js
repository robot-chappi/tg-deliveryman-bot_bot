const Router = require('express')
const privilegeController = require('../controllers/privilegeController')
const checkRoleMiddleware = require('../middleware/checkRoleMiddleware')
const router = new Router()

router.post('/', checkRoleMiddleware(['admin']), privilegeController.createPrivilege)
router.get('/all', checkRoleMiddleware(['admin']), privilegeController.getPrivileges)
router.get('/:id', checkRoleMiddleware(['admin']), privilegeController.getPrivilege)
router.delete('/:id', checkRoleMiddleware(['admin']), privilegeController.deletePrivilege)
router.patch('/:id', checkRoleMiddleware(['admin']), privilegeController.patchPrivilege)


module.exports = router