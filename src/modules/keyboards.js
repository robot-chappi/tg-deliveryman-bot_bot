const {STORE} = require('./variables')
module.exports = {
  botOptions: {
    reply_markup: JSON.stringify({
      keyboard: [
        [{text: 'Открыть магазин 🛍'}],
        [{text: 'Аккаунт 📃'}],
        [{text: 'Тарифы 🍨'}],
        [{text: 'Мои заказы 💵'}],
        [{text: 'Оставить отзыв 📝'}],
        [{text: 'Информация о компании 📈'}],
      ]
    })
  },

  storeOptions: {
    reply_markup: JSON.stringify({
      inline_keyboard: [
        [{text: 'Играть еще раз?', callback_data: '/again'}],
      ]
    })
  }
}