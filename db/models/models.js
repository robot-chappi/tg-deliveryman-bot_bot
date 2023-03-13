const sequelize = require('../db');
const {DataTypes} = require('sequelize')

const User = sequelize.define('user', {
  id: {type: DataTypes.INTEGER, primaryKey: true, unique: true, autoIncrement: true},
  chatId: {type: DataTypes.STRING, unique: true},
  name: {type: DataTypes.STRING, allowNull: false},
  phoneNumber: {type: DataTypes.STRING, allowNull: false},
  address: {type: DataTypes.STRING, allowNull: false},
  // role: {type: DataTypes.INTEGER},
  // tariff: {type: DataTypes.INTEGER},
})

const Role = sequelize.define('role', {
  id: {type: DataTypes.INTEGER, primaryKey: true, unique: true, autoIncrement: true},
  title: {type: DataTypes.STRING, allowNull: false},
  slug: {type: DataTypes.STRING, unique: true}
})

const Privilege = sequelize.define('privilege', {
  id: {type: DataTypes.INTEGER, primaryKey: true, unique: true, autoIncrement: true},
  title: {type: DataTypes.STRING, allowNull: false},
})

const Tariff = sequelize.define('tariff', {
  id: {type: DataTypes.INTEGER, primaryKey: true, unique: true, autoIncrement: true},
  title: {type: DataTypes.STRING, allowNull: false},
  description: {type: DataTypes.STRING, allowNull: false},
  price: {type: DataTypes.INTEGER, defaultValue: 0},
  discount: {type: DataTypes.INTEGER, defaultValue: 0},
  // privileges
})

const Faq = sequelize.define('faq', {
  id: {type: DataTypes.INTEGER, primaryKey: true, unique: true, autoIncrement: true},
  title: {type: DataTypes.STRING, allowNull: false},
  description: {type: DataTypes.TEXT, allowNull: false},
})

const Category = sequelize.define('category', {
  id: {type: DataTypes.INTEGER, primaryKey: true, unique: true, autoIncrement: true},
  title: {type: DataTypes.STRING, allowNull: false},
})

const Type = sequelize.define('type', {
  id: {type: DataTypes.INTEGER, primaryKey: true, unique: true, autoIncrement: true},
  title: {type: DataTypes.STRING, allowNull: false},
})

const Ingredient = sequelize.define('ingredient', {
  id: {type: DataTypes.INTEGER, primaryKey: true, unique: true, autoIncrement: true},
  title: {type: DataTypes.STRING, allowNull: false},
})

const FavoriteProduct = sequelize.define('favorite_product', {
  id: {type: DataTypes.INTEGER, primaryKey: true, unique: true, autoIncrement: true}
})

const FavoriteProductProduct = sequelize.define('favorite_product_product', {
  id: {type: DataTypes.INTEGER, primaryKey: true, unique: true, autoIncrement: true}
})

const FavoriteIngredient = sequelize.define('favorite_ingredient', {
  id: {type: DataTypes.INTEGER, primaryKey: true, unique: true, autoIncrement: true}
})

const FavoriteIngredientIngredient = sequelize.define('favorite_ingredient_ingredient', {
  id: {type: DataTypes.INTEGER, primaryKey: true, unique: true, autoIncrement: true}
})

const UnlovedIngredient = sequelize.define('unloved_ingredient', {
  id: {type: DataTypes.INTEGER, primaryKey: true, unique: true, autoIncrement: true}
})

const UnlovedIngredientIngredient = sequelize.define('unloved_ingredient_ingredient', {
  id: {type: DataTypes.INTEGER, primaryKey: true, unique: true, autoIncrement: true}
})

const MealPlan = sequelize.define('mealplan', {
  id: {type: DataTypes.INTEGER, primaryKey: true, unique: true, autoIncrement: true}
})

const MealPlanProduct = sequelize.define('mealplan_product', {
  id: {type: DataTypes.INTEGER, primaryKey: true, unique: true, autoIncrement: true},
  day: {type: DataTypes.STRING, allowNull: false}
})

const Order = sequelize.define('order', {
  id: {type: DataTypes.INTEGER, primaryKey: true, unique: true, autoIncrement: true},
  fullname: {type: DataTypes.STRING, allowNull: false},
  address: {type: DataTypes.STRING, allowNull: false},
  phoneNumber: {type: DataTypes.STRING, allowNull: false},
  wish: {type: DataTypes.STRING},
  price: {type: DataTypes.INTEGER, allowNull: false},
  isComplete: {type: DataTypes.BOOLEAN, defaultValue: false}
  // From User
  // favoriteCategory
  // favoriteIngredients
  // unlovedIngredients
  // FavoriteFood

  // MealPlan
})

const Product = sequelize.define('product', {
  id: {type: DataTypes.INTEGER, primaryKey: true, unique: true, autoIncrement: true},
  title: {type: DataTypes.STRING, allowNull: false},
  weight: {type: DataTypes.INTEGER, defaultValue: 100},
  image: {type: DataTypes.STRING, allowNull: false},
  description: {type: DataTypes.TEXT, allowNull: false},
  price: {type: DataTypes.INTEGER, allowNull: false}
  // type
  // category
  // ingredients
})

const PrivilegeTariff = sequelize.define('privilege_tariff', {
  id: {type: DataTypes.INTEGER, primaryKey: true, unique: true, autoIncrement: true},
})

const IngredientProduct = sequelize.define('ingredient_product', {
  id: {type: DataTypes.INTEGER, primaryKey: true, unique: true, autoIncrement: true},
})

User.hasOne(FavoriteProduct)
FavoriteProduct.belongsTo(User)

FavoriteProduct.hasMany(FavoriteProductProduct)
FavoriteProductProduct.belongsTo(FavoriteProduct)

Product.hasMany(FavoriteProductProduct);
FavoriteProductProduct.belongsTo(Product)


User.hasOne(FavoriteIngredient)
FavoriteIngredient.belongsTo(User)

FavoriteIngredient.hasMany(FavoriteIngredientIngredient)
FavoriteIngredientIngredient.belongsTo(FavoriteIngredient)

Ingredient.hasMany(FavoriteIngredientIngredient);
FavoriteIngredientIngredient.belongsTo(Ingredient)


Order.hasOne(MealPlan)
MealPlan.belongsTo(Order)

MealPlan.hasMany(MealPlanProduct)
MealPlanProduct.belongsTo(MealPlan)

Product.hasMany(MealPlanProduct);
MealPlanProduct.belongsTo(Product)



User.hasOne(UnlovedIngredient)
UnlovedIngredient.belongsTo(User)

UnlovedIngredient.hasMany(UnlovedIngredientIngredient)
UnlovedIngredientIngredient.belongsTo(UnlovedIngredient)

Ingredient.hasMany(UnlovedIngredientIngredient);
UnlovedIngredientIngredient.belongsTo(Ingredient)


Category.hasMany(Order)
Order.belongsTo(Category, {
  foreignKey: {
    name: 'category_id',
    defaultValue: 1
  }
});


Role.hasMany(User)
// default user
User.belongsTo(Role);

Category.hasMany(Product)
Product.belongsTo(Category);

Type.hasMany(Product)
Product.belongsTo(Type);

Tariff.hasMany(User)
// default 1 (ЭКО)
User.belongsTo(Tariff);


Tariff.belongsToMany(Privilege, {through: PrivilegeTariff})
Privilege.belongsToMany(Tariff, {through: PrivilegeTariff})

Ingredient.belongsToMany(Product, {through: IngredientProduct})
Product.belongsToMany(Ingredient, {through: IngredientProduct})


module.exports = {
  User,
  Role,
  Tariff,
  Privilege,
  Category,
  Type,
  Product,
  Order,
  FavoriteProduct,
  FavoriteProductProduct,
  MealPlan,
  MealPlanProduct,
  IngredientProduct,
  Faq,
  UnlovedIngredient,
  UnlovedIngredientIngredient,
  Ingredient,
  FavoriteIngredient,
  FavoriteIngredientIngredient,
}