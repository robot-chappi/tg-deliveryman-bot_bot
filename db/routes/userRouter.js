const Router = require('express')
const userController = require('../controllers/userController')
const authMiddleware = require('../middleware/authMiddleware')
const checkRoleMiddleware = require('../middleware/checkRoleMiddleware')
const router = new Router()

router.post('/', userController.createUser)
router.get('/all/information/:id', checkRoleMiddleware(['admin', 'analyst', 'copywriter']), userController.getUserWithAllInformation)
router.get('/pagination', checkRoleMiddleware(['admin', 'analyst', 'copywriter']), userController.paginationUser)
router.get('/me/:chatId', userController.getMe)
router.get('/me/favoriteproduct/:chatId', userController.getMyFavoriteProduct)
router.get('/me/favoriteingredient/:chatId', userController.getMyFavoriteIngredient)
router.get('/me/unlovedingredient/:chatId', userController.getMyUnlovedIngredient)
router.post('/token/:chatId', userController.getToken)
router.get('/all', checkRoleMiddleware(['admin', 'analyst', 'copywriter']), userController.getUsers)
router.get('/:id', authMiddleware, userController.getUser)
router.delete('/:id', checkRoleMiddleware(['admin']), userController.deleteUser)
router.patch('/change', userController.changeUser)
router.patch('/change/tariff', userController.changeUserTariff)
router.patch('/:id', checkRoleMiddleware(['admin', 'analyst', 'copywriter']), userController.patchUser)


module.exports = router