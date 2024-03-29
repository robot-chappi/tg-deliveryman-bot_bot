const Router = require('express')
const tariffController = require('../controllers/tariffController')
const checkRoleMiddleware = require('../middleware/checkRoleMiddleware')
const router = new Router()

router.post('/', checkRoleMiddleware(['admin', 'analyst', 'copywriter']), tariffController.createTariff)
router.get('/all', tariffController.getTariffs)
router.get('/privilege/:id', tariffController.getTariffWithPrivileges)
router.get('/:id', tariffController.getTariff)
router.delete('/:id', checkRoleMiddleware(['admin', 'analyst', 'copywriter']), tariffController.deleteTariff)
router.patch('/:id', checkRoleMiddleware(['admin', 'analyst', 'copywriter']), tariffController.patchTariff)


module.exports = router