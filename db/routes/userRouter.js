const Router = require('express')
const userController = require('../controllers/userController')
const authMiddleware = require('../middleware/authMiddleware')
const checkRoleMiddleware = require('../middleware/checkRoleMiddleware')
const router = new Router()

router.post('/', userController.createUser)
router.get('/me/:chatId', userController.getMe)
router.post('/token/:chatId', userController.getToken)
router.get('/all', checkRoleMiddleware(['admin']), userController.getUsers)
router.get('/:id', authMiddleware, userController.getUser)
router.delete('/:id', checkRoleMiddleware(['admin']), userController.deleteUser)
router.patch('/change', userController.changeUser)
router.patch('/change/tariff', userController.changeUserTariff)
router.patch('/:id', checkRoleMiddleware(['admin']), userController.patchUser)


module.exports = router