const Router = require('express')
const faqController = require('../controllers/faqController')
const router = new Router()

router.post('/', faqController.createFaq)
router.get('/all', faqController.getFaqs)
router.get('/:id', faqController.getFaq)
router.delete('/:id', faqController.deleteFaq)
router.patch('/:id', faqController.patchFaq)


module.exports = router