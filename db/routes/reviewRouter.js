const Router = require('express')
const reviewController = require('../controllers/reviewController')
const checkRoleMiddleware = require('../middleware/checkRoleMiddleware')
const router = new Router()

router.post('/', reviewController.createReview)
router.post('/checkreview/:id', checkRoleMiddleware(['admin']), reviewController.checkedUncheckedReview)
router.get('/pagination', reviewController.paginationReviews)
router.get('/all', reviewController.getReviews)
router.get('/checked', reviewController.getCheckedReviews)
router.get('/user/all/:chatId', reviewController.getUserReviews)
router.get('/:id', reviewController.getReview)
router.patch('/:id', reviewController.patchReview)
router.delete('/user', reviewController.deleteUserReview)
router.delete('/user/:chatId', reviewController.deleteUserReviews)
router.delete('/:id', checkRoleMiddleware(['admin']), reviewController.deleteReview)


module.exports = router