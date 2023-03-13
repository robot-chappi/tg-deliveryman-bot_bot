const ApiError = require('../error/ApiError')
const {Product, Ingredient} = require('../models/models')
const {createProductValidation} = require('../validations/product/createProductValidation')
const {updateProductValidation} = require('../validations/product/updateProductValidation')

class ProductController {
  async getProducts(req, res) {
    try {
      const products = await Product.findAll({ include: ["category", "type"] });
      return res.json(products)
    } catch (e) {
      console.log(e)
    }
  }

  async getProduct(req, res) {
    try {
      const {id} = req.params
      let productItem;
      const product = await Product.findOne({where: {id: id}, include: ["category", "type"]}).then(product => {
        if(!product) return product;
        productItem = product;
        return product.getIngredients()
      })

      console.log(product)

      return res.json({product: productItem, ingredients: product})
    } catch (e) {
      console.log(e)
    }
  }

  async createProduct(req, res, next) {
    try {
      const {error} = createProductValidation(req.body);
      if(error) {
        return next(ApiError.badRequest('Что-то введено не верно'))
      }
      const {title, weight, image, description, price, categoryId, typeId, ingredients} = req.body
      const product = await Product.create({title, description, price, weight, image, categoryId: categoryId, typeId: typeId})
      for (const i of ingredients) {
        const ingredient = await Ingredient.findOne({where: {id: i.id}})
        product.addIngredient(ingredient)
      }
      return res.json(product);
    } catch (e) {
      console.log(e)
    }
  }

  async deleteProduct(req, res) {
    try {
      const {id} = req.params
      await Product.findOne({where: {id: id}})
        .then(product=>{
          if(!product) return;
          product.getIngredients().then(ingredients=>{
            for(let i = 0; i < ingredients.length; i++){
              if(product.id===ingredients[i]['ingredient_product'].productId) ingredients[i]['ingredient_product'].destroy();
            }
          });
        });
      await Product.destroy({where: {id: id}})
      return res.json({message: 'Успешно удалено'})
    } catch (e) {
      console.log(e)
    }
  }

  async patchProduct(req, res, next) {
    try {
      const {error} = updateProductValidation(req.body);
      if(error) {
        return next(ApiError.badRequest('Что-то не правильно введено'))
      }

      const {id} = req.params
      const {title, weight, image, description, price, categoryId, typeId, ingredients} = req.body
      const product = await Product.findOne({where: {id: id}})

      await product.update({title: title, description: description, price: price, weight: weight, image: image, categoryId: categoryId, typeId: typeId})
      const productItem = await product.getIngredients()


      if (productItem.length > ingredients.length || productItem.length < ingredients.length || productItem.length === ingredients.length) {
        if (productItem.length !== 0) {
          for (let i = 0; i < productItem.length; i++) {
            productItem[i]['ingredient_product'].destroy();
          }
        }
        if (ingredients.length !== 0) {
          for (const i of ingredients) {
            const ingredientItem = await Ingredient.findOne({where: {id: i.id}})
            if (ingredientItem) await product.addIngredient(ingredientItem)
          }
        }
      }

      return res.json({message: 'Обновлено!'});
    } catch (e) {
      console.log(e)
    }
  }
}

module.exports = new ProductController()