const {User} = require('../models/models')
module.exports = function(chatId, role) {
  return async function (req, res, next) {
    if (req.method === "OPTIONS") {
      next()
    }
    try {
      const user = await User.findOne({where: {chatId: chatId}});

      if (!user) {
        return res.status(401).json({message: "Нету"})
      }

      if (user.role !== role) {
        return res.status(403).json({message: "Нет доступа"})
      }

      next()
    } catch (e) {
      res.status(401).json({message: "Нету"})
    }
  };
}