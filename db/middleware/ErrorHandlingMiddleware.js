const ApiError = require('../error/ApiError')

module.exports = function (err, req, res, next) {
  return res.status(err.status ? err.status : 500).json({message: err.message ? err.message : 'Непредвиденная ошибка!'})
}