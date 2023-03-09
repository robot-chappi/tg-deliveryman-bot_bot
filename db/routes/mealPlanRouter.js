const Router = require('express')
const mealPlanController = require('../controllers/mealPlanController')
const router = new Router()

router.post('/', mealPlanController.createMealPlan)
router.get('/all', mealPlanController.getMealPlans)
router.get('/:id', mealPlanController.getMealPlan)
router.delete('/:id', mealPlanController.deleteMealPlan)

module.exports = router