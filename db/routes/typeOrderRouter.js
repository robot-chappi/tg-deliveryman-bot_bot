const Router = require('express')
const typeOrderController = require('../controllers/typeOrderController')
const router = new Router()

router.post('/', typeOrderController.createTypeOrder)
router.get('/all', typeOrderController.getTypesOrder)
router.get('/:id', typeOrderController.getTypeOrder)
router.delete('/:id', typeOrderController.deleteTypeOrder)
router.patch('/:id', typeOrderController.patchTypeOrder)


module.exports = router