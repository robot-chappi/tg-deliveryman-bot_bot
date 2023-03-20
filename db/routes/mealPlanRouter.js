const Router = require('express')
const mealPlanController = require('../controllers/mealPlanController')
const router = new Router()

router.post('/', mealPlanController.createMealPlanProduct)
router.post('/products', mealPlanController.createMealPlanProducts)
router.get('/all/:id', mealPlanController.getMealPlanProducts)
router.delete('/all/:id', mealPlanController.deleteMealPlanProducts)
router.delete('/', mealPlanController.deleteMealPlanProduct)

module.exports = router