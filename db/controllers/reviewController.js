const ApiError = require('../error/ApiError')
const {Review, User} = require('../models/models')
const {createReviewValidation} = require('../validations/review/createReviewValidation')
const {updateReviewValidation} = require('../validations/review/updateReviewValidation')

class ReviewController {
  async getReviews(req, res) {
    try {
      const reviews = await Review.findAll({include: 'user'});
      return res.json(reviews)
    } catch (e) {
      console.log(e)
    }
  }

  async getUserReviews(req, res) {
    try {
      const {chatId} = req.params;
      const reviews = await Review.findAll({where: {chatId: chatId}, include: 'user'});
      return res.json(reviews)
    } catch (e) {
      console.log(e)
    }
  }

  async paginationReviews(req, res) {
    try {
      let {mark, isChecked, limit, page} = req.query
      page = page || 1
      limit = limit || 3
      let offset = page * limit - limit
      let reviews;
      if (!mark && !isChecked) {
        reviews = await Review.findAndCountAll({limit: limit, offset: offset, include: ["user"]});
      }
      if (mark && !isChecked) {
        reviews = await Review.findAndCountAll({where: {mark: mark}, limit: limit, offset: offset, include: ["user"]});
      }
      if (!mark && isChecked) {
        reviews = await Review.findAndCountAll({where: {isChecked: isChecked}, limit: limit, offset: offset, include: ["user"]});
      }
      if (mark && isChecked) {
        reviews = await Review.findAndCountAll({where: {mark: mark, isChecked: isChecked}, limit: limit, offset: offset, include: ["user"]});
      }

      return res.json(reviews);

    } catch (e) {
      console.log(e)
    }
  }

  async getCheckedReviews(req, res) {
    try {
      const reviews = await Review.findAll({where: {isChecked: true}, include: 'user'})
      return res.json(reviews)
    } catch (e) {
      console.log(e)
    }
  }

  async getReview(req, res) {
    try {
      const {id} = req.params
      const review = await Review.findOne({where: {id: id}, include: 'user'})
      return res.json(review)
    } catch (e) {
      console.log(e)
    }
  }

  async checkedUncheckedReview(req, res) {
    try {
      const {id} = req.params
      const review = await Review.findOne({where: {id: id}});
      if (!review) return res.json({message: 'Ошибка'})
      await review.update({isChecked: review.isChecked ? false : true})
      return res.json({message: 'Обновлено!'})
    } catch (e) {
      console.log(e)
    }
  }

  async createReview(req, res, next) {
    try {
      const {error} = createReviewValidation(req.body);
      if(error) {
        return next(ApiError.badRequest('Что-то неправильно введено'))
      }
      const {text, mark, chatId, isChecked} = req.body
      const user = await User.findOne({where: {chatId: chatId}})
      if (!user) return res.json({message: 'Error', status: 'error'});
      const review = await Review.create({text: text, mark: mark, chatId: chatId, isChecked: isChecked, userId: user.id})
      return res.json(review);
    } catch (e) {
      console.log(e)
    }
  }

  async deleteReview(req, res) {
    try {
      const {id} = req.params
      await Review.destroy({where: {id: id}})
      return res.json({message: 'Успешно удалено'})
    } catch (e) {
      console.log(e)
    }
  }

  async deleteUserReview(req, res, next) {
    try {
      const {review_id, chat_id} = req.query
      const review = await Review.destroy({where: {id: Number(review_id), chatId: String(chat_id)}})
      if (!review) return res.json({message: 'Ошибка', status: 'error'})

      return res.json({message: 'Успешно удалено'})
    } catch (e) {
      console.log(e)
    }
  }

  async deleteUserReviews(req, res) {
    try {
      const {chatId} = req.params
      await Review.destroy({where: {chatId: chatId}})
      return res.json({message: 'Успешно удалено'})
    } catch (e) {
      console.log(e)
    }
  }

  async patchReview(req, res, next) {
    try {
      const {error} = updateReviewValidation(req.body);
      if(error) {
        return next(ApiError.badRequest('Что-то не правильно введено'))
      }

      const {id} = req.params
      const {text, mark, chatId, isChecked} = req.body
      const user = await User.findOne({where: {chatId: chatId}});
      if (user) {
        await Review.update({chatId: chatId, text: text, mark: mark, isChecked: isChecked, userId: user.id}, {where: {id: id}})
      } else {
        await Review.update({text: text, mark: mark, isChecked: isChecked}, {where: {id: id}})
      }

      return res.json({message: 'Обновлено!'});
    } catch (e) {
      console.log(e)
    }
  }
}

module.exports = new ReviewController()