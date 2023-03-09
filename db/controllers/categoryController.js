const ApiError = require('../error/ApiError')
const {Category} = require('../models/models')
const {createCategoryValidation} = require('../validations/category/createCategoryValidation')
const {updateCategoryValidation} = require('../validations/category/updateCategoryValidation')

class CategoryController {
  async getCategories(req, res) {
    try {
      const categories = await Category.findAll();
      return res.json(categories)
    } catch (e) {
      console.log(e)
    }
  }

  async getCategory(req, res) {
    try {
      const {id} = req.params
      const category = await Category.findOne({where: {id: id}})
      return res.json(category)
    } catch (e) {
      console.log(e)
    }
  }

  async createCategory(req, res, next) {
    try {
      const {error} = createCategoryValidation(req.body);
      if(error) {
        return next(ApiError.badRequest('Не введено название категории'))
      }
      const {title} = req.body
      const category = await Category.create({title})
      return res.json(category);
    } catch (e) {
      console.log(e)
    }
  }

  async deleteCategory(req, res) {
    try {
      const {id} = req.params
      await Category.destroy({where: {id: id}})
      return res.json({message: 'Успешно удалено'})
    } catch (e) {
      console.log(e)
    }
  }

  async patchCategory(req, res, next) {
    try {
      const {error} = updateCategoryValidation(req.body);
      if(error) {
        return next(ApiError.badRequest('Не введено название категории'))
      }

      const {id} = req.params
      const {title} = req.body

      await Category.update({title: title}, {where: {id: id}})
      return res.json({message: 'Обновлено!'});
    } catch (e) {
      console.log(e)
    }
  }
}

module.exports = new CategoryController()