const Router = require('express')
const faqController = require('../controllers/faqController')
const checkRoleMiddleware = require('../middleware/checkRoleMiddleware')
const router = new Router()

router.post('/', checkRoleMiddleware(['admin']), faqController.createFaq)
router.get('/all', faqController.getFaqs)
router.get('/:id', faqController.getFaq)
router.delete('/:id', checkRoleMiddleware(['admin']), faqController.deleteFaq)
router.patch('/:id', checkRoleMiddleware(['admin']), faqController.patchFaq)


module.exports = router