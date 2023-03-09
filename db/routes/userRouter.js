const Router = require('express')
const userController = require('../controllers/userController')
const router = new Router()

router.post('/', userController.createUser)
router.get('/all', userController.getUsers)
router.get('/:id', userController.getUser)
router.delete('/:id', userController.deleteUser)
router.patch('/:id', userController.patchUser)


module.exports = router