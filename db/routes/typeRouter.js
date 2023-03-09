const Router = require('express')
const typeController = require('../controllers/typeController')
const router = new Router()

router.post('/', typeController.createType)
router.get('/all', typeController.getTypes)
router.get('/:id', typeController.getType)
router.delete('/:id', typeController.deleteType)
router.patch('/:id', typeController.patchType)


module.exports = router