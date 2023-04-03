const Router = require('express')
const mealPlanController = require('../controllers/mealPlanController')
const authMiddleware = require('../middleware/authMiddleware')
const router = new Router()

router.post('/', authMiddleware, mealPlanController.createMealPlanProduct)
router.post('/products', authMiddleware, mealPlanController.createMealPlanProducts)
router.get('/all/:id', authMiddleware, mealPlanController.getMealPlanProducts)
router.get('/user/all/:orderId', mealPlanController.getUserMealPlanProducts)
router.patch('/:id', authMiddleware, mealPlanController.patchMealPlanPrice)
router.delete('/all/:id', authMiddleware, mealPlanController.deleteMealPlanProducts)
router.delete('/', authMiddleware, mealPlanController.deleteMealPlanProduct)

module.exports = router