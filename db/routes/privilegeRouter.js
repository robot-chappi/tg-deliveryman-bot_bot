const Router = require('express')
const privilegeController = require('../controllers/privilegeController')
const router = new Router()

router.post('/', privilegeController.createPrivilege)
router.get('/all', privilegeController.getPrivileges)
router.get('/:id', privilegeController.getPrivilege)
router.delete('/:id', privilegeController.deletePrivilege)
router.patch('/:id', privilegeController.patchPrivilege)


module.exports = router