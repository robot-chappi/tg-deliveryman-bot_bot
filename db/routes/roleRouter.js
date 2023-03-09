const Router = require('express')
const roleController = require('../controllers/roleController')
const router = new Router()

router.post('/', roleController.createRole)
router.get('/all', roleController.getRoles)
router.get('/:id', roleController.getRole)
router.delete('/:id', roleController.deleteRole)
router.patch('/:id', roleController.patchRole)


module.exports = router