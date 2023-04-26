const Router = require('express')
const faqController = require('../controllers/faqController')
const checkRoleMiddleware = require('../middleware/checkRoleMiddleware')
const router = new Router()

router.post('/', checkRoleMiddleware(['admin', 'analyst', 'copywriter']), faqController.createFaq)
router.get('/pagination', faqController.paginationFaq)
router.get('/all', faqController.getFaqs)
router.get('/:id', faqController.getFaq)
router.delete('/:id', checkRoleMiddleware(['admin', 'analyst', 'copywriter']), faqController.deleteFaq)
router.patch('/:id', checkRoleMiddleware(['admin', 'analyst', 'copywriter']), faqController.patchFaq)


module.exports = router