const Router = require('express')
const tariffController = require('../controllers/tariffController')
const router = new Router()

router.post('/', tariffController.createTariff)
router.get('/all', tariffController.getTariffs)
router.get('/:id', tariffController.getTariff)
router.delete('/:id', tariffController.deleteTariff)
router.patch('/:id', tariffController.patchTariff)


module.exports = router