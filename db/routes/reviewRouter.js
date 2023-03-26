const Router = require('express')
const reviewController = require('../controllers/reviewController')
const checkRoleMiddleware = require('../middleware/checkRoleMiddleware')
const router = new Router()

router.post('/', reviewController.createReview)
router.post('/checkreview/:id', checkRoleMiddleware(['admin']), reviewController.checkedUncheckedReview)
router.get('/all', checkRoleMiddleware(['admin']), reviewController.getReviews)
router.get('/checked', reviewController.getCheckedReviews)
router.get('/user/all/:chatId', reviewController.getUserReviews)
router.get('/:id', reviewController.getReview)
router.delete('/:id', checkRoleMiddleware(['admin']), reviewController.deleteReview)
router.delete('/user', reviewController.deleteUserReview)
router.delete('/user/:chatId', reviewController.deleteUserReviews)


module.exports = router