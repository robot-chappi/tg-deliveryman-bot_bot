const jwt = require('jsonwebtoken')
const ApiError = require('../error/ApiError')

module.exports = function (req, res, next) {
  if (req.method === "OPTIONS") {
    next()
  }
  try {
    const token = req.headers.authorization.split(' ')[1] // Bearer asfasnfkajsfnjk
    if (!token) {
      return next(ApiError.badRequest('Такого пользователя нету'))
    }
    const decoded = jwt.verify(token, process.env.SECRET_KEY)
    req.user = decoded
    next()
  } catch (e) {
    next(ApiError.badRequest('Такого пользователя нету'))
  }
};