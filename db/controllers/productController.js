const ApiError = require('../error/ApiError')
const {Product, Ingredient, IngredientProduct} = require('../models/models')
const {createProductValidation} = require('../validations/product/createProductValidation')
const {updateProductValidation} = require('../validations/product/updateProductValidation')
const uuid = require('uuid')
const path = require('path')
const fs = require('fs')

class ProductController {
  async getProducts(req, res) {
    try {
      const products = await Product.findAll({ include: ["category", "type"] });
      return res.json(products)
    } catch (e) {
      console.log(e)
    }
  }

  async getProductsWithIngredients(req, res) {
    try {
      const products = await Product.findAll({ include: ["category", "type", {model: Ingredient, through: IngredientProduct}] });
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

      return res.json({product: productItem, ingredients: product})
    } catch (e) {
      console.log(e)
    }
  }

  async paginationProduct(req, res) {
    try {
      let {categoryId, typeId, limit, page} = req.query
      page = page || 1
      limit = limit || 3
      let offset = page * limit - limit
      let products;
      if (!categoryId && !typeId) {
        products = await Product.findAndCountAll({limit: limit, offset: offset, include: ["category", "type"]});
      }
      if (categoryId && !typeId) {
        products = await Product.findAndCountAll({where: {categoryId: categoryId}, limit: limit, offset: offset, include: ["category", "type"]});
      }
      if (!categoryId && typeId) {
        products = await Product.findAndCountAll({where: {typeId: typeId}, limit: limit, offset: offset, include: ["category", "type"]});
      }
      if (categoryId && typeId) {
        products = await Product.findAndCountAll({where: {categoryId: categoryId, typeId: typeId}, limit: limit, offset: offset, include: ["category", "type"]});
      }

      return res.json(products);

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
      const {title, image, weight, description, price, categoryId, typeId, ingredients} = req.body
      const imageFile = req.files ? req.files['imageFile'] : false

      let fileName;
      if (imageFile) {
        fileName = uuid.v4() + ".jpg"
        imageFile.mv(path.resolve(__dirname, '..', 'static', fileName))
      }
      const product = await Product.create({title, description, price, weight, image: imageFile ? fileName : image, categoryId: categoryId, typeId: typeId})

      for (const i of ingredients) {
        const ingredient = await Ingredient.findOne({where: {id: i.id}})
        product.addIngredient(ingredient)
      }
      return res.json(product);
    } catch (e) {
      next(ApiError.badRequest('Что-то введено не верно | ' + e))
    }
  }

  async deleteProduct(req, res) {
    try {
      const {id} = req.params

      let filePath;
      await Product.findOne({where: {id: id}})
        .then(product=>{
          if(!product) return;
          filePath = product.image

          product.getIngredients().then(ingredients=>{
            for(let i = 0; i < ingredients.length; i++){
              if(product.id===ingredients[i]['ingredient_product'].productId) ingredients[i]['ingredient_product'].destroy();
            }
          });
        });
      await Product.destroy({where: {id: id}})

      if (!filePath.includes('http')) fs.unlinkSync(path.resolve(__dirname, '..', 'static', filePath))
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
      const {title, weight, description, image, price, categoryId, typeId, ingredients} = req.body
      const imageFile = req.files ? req.files['imageFile'] : false

      const product = await Product.findOne({where: {id: id}})

      if (!product.image.includes('http') && image.includes('http')) {
        try {
          fs.unlinkSync(path.resolve(__dirname, '..', 'static', product.image))
        } catch (e) {
          console.log(e)
        }
      }

      let fileName;
      if (imageFile) {
        try {
          if (!product.image.includes('http')) fs.unlinkSync(path.resolve(__dirname, '..', 'static', product.image))
          fileName = uuid.v4() + ".jpg"
          imageFile.mv(path.resolve(__dirname, '..', 'static', fileName))
        } catch (e) {
          fileName = uuid.v4() + ".jpg"
          imageFile.mv(path.resolve(__dirname, '..', 'static', fileName))
        }
      }
      await product.update({title: title, description: description, image: imageFile ? fileName : image, price: price, weight: weight, categoryId: categoryId, typeId: typeId})
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