import TelegramBotClient from 'node-telegram-bot-api'
import StateMachine from 'javascript-state-machine'
import respondTo from './modules/registration'
import {STORE} from './modules/variables'
import changeAccountData from './modules/changeAccountData'
import {botOptions} from './modules/keyboards'
import leaveReview from './modules/leaveReview'
import {changeUserTariff, getFavoriteIngredient, getFavoriteProduct, getMe, getUnlovedIngredient} from './http/userAPI'
import {getTariffItems} from './http/tariffAPI'
import {getMealPlan, getOrder, getOrders, deleteOrders, deleteOrder} from './http/orderAPI'
import {deleteUserReviews, getUserReviews} from './http/reviewAPI'
import deleteReviewFsm from './modules/deleteReviewFsm'
// import sequelize from '../db/db'
const express = require('express')
const cors = require('cors')
const fileUpload = require('express-fileupload')
const sequelize = require('../db/db')
const models = require('../db/models/models')
const router = require('../db/routes/index')
const errorHandler = require('../db/middleware/ErrorHandlingMiddleware')
const path = require('path')
// const {order} = require('../src/mockdata/mockdata')

export default class Bot {
  constructor(token) {
    this.PORT = process.env.PORT || 5000
    this.app = express()
    this.app.use(cors())
    this.app.use(fileUpload({}))
    this.app.use(express.json())
    this.app.use(express.static(path.resolve(__dirname, '..', 'db', 'static')))
    this.app.use('/api', router)
    this.app.use(errorHandler)

    this.client = new TelegramBotClient(token, { polling: true })
    this.website = STORE

  }

  async start() {

    try {
      await sequelize.authenticate()
      await sequelize.sync()
      this.app.listen(this.PORT, () => console.log('Сервер запушен на порту ' + this.PORT))
    } catch (e) {
      console.log('Подключение к DB сломалось', e)
    }

    this.client.on('message', async (message) => {
      const chatId = message.chat.id
      const text = message.text
      const user = {name: 'Иван Иванов Иванович', phone: '+79201563122', address: 'Россия, Московская обл., Москва, ул. Пушкина, д. 20'}
      // const order = {tariff: 'Эко', category: 'Правильное питание', food: {
      //   monday: [
      //     {name: 'Пицца', price: 150, quantity: 1}, {name: 'Роллы', price: 200, quantity: 1}, {name: 'Печенье', price: 250, quantity: 1}
      //   ],
      //   tuesday: [
      //     {name: 'Каша', price: 150, quantity: 1}, {name: 'Роллы', price: 200, quantity: 1}, {name: 'Печенье', price: 250, quantity: 1}
      //   ],
      //   wednesday: [
      //     {name: 'Суп', price: 150, quantity: 1}, {name: 'Роллы', price: 200, quantity: 1}, {name: 'Печенье', price: 250, quantity: 1}
      //   ],
      //   thursday: [
      //     {name: 'Салат', price: 150, quantity: 1}, {name: 'Роллы', price: 200, quantity: 1}, {name: 'Печенье', price: 250, quantity: 1}
      //   ],
      //   friday: [
      //     {name: 'Яблоко', price: 150, quantity: 1}, {name: 'Роллы', price: 200, quantity: 1}, {name: 'Печенье', price: 250, quantity: 1}
      //   ],
      //   saturday: [
      //     {name: 'Груша', price: 150, quantity: 1}, {name: 'Роллы', price: 200, quantity: 1}, {name: 'Печенье', price: 250, quantity: 1}
      //   ],
      //   sunday: [
      //     {name: 'Апельсин', price: 150, quantity: 1}, {name: 'Роллы', price: 200, quantity: 1}, {name: 'Печенье', price: 250, quantity: 1}
      //   ]
      // }, full_price_per_month: 2000, payment: 0}
      // const tariff = [
      //   {name: 'ПРО 🥇', description: '', features: [
      //       {text: 'Быстрая доставка'},
      //       {text: 'Личный куратор по еде'},
      //       {text: 'Что-то еще...'},
      //       {text: 'Что-то еще...'},
      //   ], price_per_month: 3000},
      //   {name: 'СРЕДНИЙ 🥈', description: '', features: [
      //       {text: 'Быстрая доставка'},
      //       {text: 'Куратор по еде'},
      //       {text: 'Что-то еще...'},
      //       {text: 'Что-то еще...'},
      //   ], price_per_month: 1000},
      //   {name: 'ЭКО 🥉', description: '', features: [
      //       {text: 'Что-то еще...'},
      //       {text: 'Что-то еще...'},
      //       {text: 'Что-то еще...'},
      //       {text: 'Что-то еще...'},
      //   ], price_per_month: 500}
      // ]

      try {
        if (text === '/start') {
          return this.client.sendMessage(chatId, 'Привет, я доставщик вкусной еды на каждый день! 😁 \n\n' +
            'Я обладаю большим каталогом еды, которую я могу тебе доставлять каждый день на протяжении месяца 🍑\n\n' +
            'Мои плюсы: \n' +
            '1. Не нужно беспокоиться что бы приготовить на утро/день/вечер ⭐\n' +
            '2. Широкий выбор еды 🍲\n' +
            '3. Цены ниже ресторанов 🔥\n' +
            '4. Вкусные тарифы 💵\n\n' +
            'Если я тебя заинтересовал, то я хочу получше с тобой познакомиться!', {
              reply_markup: JSON.stringify({
                inline_keyboard: [
                [{text: 'Давай! ☀', callback_data: 'next-meet-1'}],
                [{text: 'Не хочу 🐀', callback_data: '/bye'}],
                ]
              })
            })
        }

        if (text === '/reload') {
          try {
            const user = await getMe(chatId)
            if (user) {
              return this.client.sendMessage(chatId, 'Прошу к столу, как говорится', botOptions)
            }
            await this.client.sendMessage(chatId, 'Хорошо, перезагружаю', {
              reply_markup: JSON.stringify({
                  hide_keyboard: true
              }
              )
            })
            return this.client.sendMessage(chatId, 'Привет, я доставщик вкусной еды на каждый день! 😁 \n\n' +
              'Я обладаю большим каталогом еды, которую я могу тебе доставлять каждый день на протяжении месяца 🍑\n\n' +
              'Мои плюсы: \n' +
              '1. Не нужно беспокоиться что бы приготовить на утро/день/вечер ⭐\n' +
              '2. Широкий выбор еды 🍲\n' +
              '3. Цены ниже ресторанов 🔥\n' +
              '4. Вкусные тарифы 💵\n\n' +
              'Если я тебя заинтересовал, то я хочу получше с тобой познакомиться!', {
              reply_markup: JSON.stringify({
                inline_keyboard: [
                  [{text: 'Давай! ☀', callback_data: 'next-meet-1'}],
                  [{text: 'Не хочу 🐀', callback_data: '/bye'}],
                ]
              })
            })
          } catch (e) {
            console.log(e)
          }

        }

        if (text === 'Открыть магазин 🛍') {
          const user = await getMe(chatId);
          if (!user) return this.client.sendMessage(chatId, 'Зарегистрируйся по функции /start 🙂')
          return this.client.sendMessage(chatId, 'В моем магазине по доставке ты сможешь найти кучу вкусных блюд, ' +
            'которые точно тебе приглянутся! Просто настрой свой день на каждый день недели, а затем я свяжусь с тобой и мы утвердим доставку! 🍓', {
              reply_markup: JSON.stringify({
                inline_keyboard: [
                [{text: 'Магазин ⭐', web_app: {url: this.website}}]
                ]
              })
            })
        }

        if (text === 'Оставить отзыв 📝') {
          const user = await getMe(chatId);
          if (!user) return this.client.sendMessage(chatId, 'Зарегистрируйся по функции /start 🙂')

          return leaveReview(message, this.client)
        }

        if (text === 'Посмотреть свои отзывы ✅') {
          const user = await getMe(chatId);
          if (!user) return this.client.sendMessage(chatId, 'Зарегистрируйся по функции /start 🙂')

          const userReviews = await getUserReviews(chatId);

          return this.client.sendMessage(chatId, `Все твои отзывы:\n\n${userReviews.map((i) => {return `ID: ${i.id}\nОтзыв: ${i.text}\nОценка: ${i.mark}/10\nОпубликован: ${i.isChecked ? 'да' : 'нет'}\n\n`}).join('')}Вы можете удалить все или один отзыв, а так же когда пройдет модерация - увидеть свой отзыв в нашем магазине! 🙂`, {
            reply_markup: JSON.stringify({
              inline_keyboard: [
                [{text: 'Удалить всё ❌', callback_data: 'deleteAllReviews'}],
                [{text: 'Удалить один 📝', callback_data: 'deleteOneReview'}],
                [{text: 'Хорошо 👍', callback_data: 'ok'}],
              ]
            })
          })
        }

        if (text === 'Аккаунт 📃') {
          const user = await getMe(chatId);
          if (!user) return this.client.sendMessage(chatId, 'Зарегистрируйся по функции /start 🙂')

          // const user = await getMe(chatId);
          await this.client.sendMessage(chatId, `Данные о тебе: 📰\n\nИмя: ${user.name}\nТелефон: ${user.phoneNumber}\nАдрес: ${user.address}\nТариф: ${user.tariff.title}\nРоль: ${user.role.title}`, {
            reply_markup: JSON.stringify({
              remove_keyboard: true
            }),
          })
          return this.client.sendMessage(chatId, 'Хотите что-то изменить? ⚙', {
            reply_markup: JSON.stringify({
              inline_keyboard: [
                [{text: 'Да ✏', callback_data: 'changeData'}],
                [{text: 'Нет 🚀', callback_data: 'dontChangeData'}],
              ]
            }),
          })
        }

        if (text === 'Тарифы 🍨') {
          const user = await getMe(chatId);
          if (!user) return this.client.sendMessage(chatId, 'Зарегистрируйся по функции /start 🙂')

          const tariffItems = await getTariffItems();
          // const user = await getMe(chatId);
          let tariffKeyboard = []
          let otherTariff = tariffItems.filter(function( obj ) {
            return obj.id !== user.tariff.id;
          });
          otherTariff.map(i => {
            return tariffKeyboard.push([{text: `Подключить ${i.title} ${i.title === 'ЭКО' ? '🥉' : i.title === 'СРЕДНИЙ' ? '🥈' : '🥇'}`, callback_data: `got${i.title}`}])
          })

          return this.client.sendMessage(chatId, `${tariffItems.map(i => {
            return `Тариф ${i.title} ${i.id === user.tariff.id ? '(выбран)' : ''}\nОписание: ${i.description}\nСкидка: ${i.discount}%\nПреимущества: \n${i.privileges.map(f => {
              return `⚫ ${f.title}\n`
            }).join('')}\n\nЦена: ${i.price} руб.\n\n`
          }).join('')}`, {
            reply_markup: JSON.stringify({
              inline_keyboard: tariffKeyboard
            }),
          })
        }

        if (text === 'Информация о компании 📈') {
          const user = await getMe(chatId);
          if (!user) return this.client.sendMessage(chatId, 'Зарегистрируйся по функции /start 🙂')
          return this.client.sendMessage(chatId, `Мы доставляем еду каждый день и решаем сразу несколько проблем 🤜\n\n1. Не нужно думать чего бы поесть утром/днем/вечером 😊\n2. Не нужно тратить время на готовку 👀\n3. Не нужно уметь готовить, чтобы вкусно поесть 😬\n\nПожалуй это все 😎`)
        }

        if (text === 'Мои заказы 💵') {
          const user = await getMe(chatId);
          if (!user) return this.client.sendMessage(chatId, 'Зарегистрируйся по функции /start 🙂')
          // const user = await getMe(chatId);
          const order = await getOrder(chatId);

          if (!order) {
            return this.client.sendMessage(chatId, 'У вас нету активных заказов, вы можете посмотреть все ваши заказы по кнопке ниже 😄', {
              reply_markup: JSON.stringify({
                inline_keyboard: [
                  [{text: 'Открыть все 🍔', callback_data: 'allorders'}],
                  [{text: 'Не нужно 😒', callback_data: 'dontChangeData'}]
                ]
              }),
            })
          }

          const mealPlan = await getMealPlan(order.id);
          const favoriteIngredient = await getFavoriteIngredient(user.id);
          const unlovedIngredient = await getUnlovedIngredient(user.id);
          const favoriteProduct = await getFavoriteProduct(user.id);

          await this.client.sendMessage(chatId, `Твой тариф: ${user.tariff.title} ${user.tariff.title === 'ПРО' ? '🥇' : user.tariff.title === 'СРЕДНИЙ' ? '🥈' : '🥉'}\nИмя: ${order.fullname}\nАдрес: ${order.address}\nТелефон: ${order.phoneNumber}\nКатегория: ${order.category.title}\nЛюбимые ингредиенты: ${favoriteIngredient.map((i) => {return `${i.ingredient.title}\n`}).join('')}\nНелюбимые ингредиенты: ${unlovedIngredient.map((i) => {return `${i.ingredient.title}\n`}).join('')}\nЕда из Любимое: ${favoriteProduct.map((i) => {return `${i.product.title}\n`}).join('')}\nЦена: ${(order.price - order.price/100*user.tariff.discount) + user.tariff.price} (с учетом скидки по тарифу)\nСкидка: ${user.tariff.discount}%\nПожелания: ${order.wish}\nВыполнено: ${order.isComplete ? 'да' : 'нет'}\nОплачено: ${order.isPaid ? 'да' : 'нет'}\n\nРацион:\nПонедельник: \n${mealPlan['Понедельник'].map(i => {
            return `${i.title + ' | ' + i.price + 'руб.' + ' | ' + i.weight} \n`
          }).join('')}\nВторник: \n${mealPlan['Вторник'].map(i => {
            return `${i.title + ' | ' + i.price + 'руб.' + ' | ' + i.weight} \n`
          }).join('')}\nСреда: \n${mealPlan['Среда'].map(i => {
            return `${i.title + ' | ' + i.price + 'руб.' + ' | ' + i.weight} \n`
          }).join('')}\nЧетверг: \n${mealPlan['Четверг'].map(i => {
            return `${i.title + ' | ' + i.price + 'руб.' + ' | ' + i.weight} \n`
          }).join('')}\nПятница: \n${mealPlan['Пятница'].map(i => {
            return `${i.title + ' | ' + i.price + 'руб.' + ' | ' + i.weight} \n`
          }).join('')}\nСуббота: \n${mealPlan['Суббота'].map(i => {
            return `${i.title + ' | ' + i.price + 'руб.' + ' | ' + i.weight} \n`
          }).join('')}\nВоскресенье: \n${mealPlan['Воскресенье'].map(i => {
            return `${i.title + ' | ' + i.price + 'руб.' + ' | ' + i.weight} \n`
          }).join('')}
          `, {
            reply_markup: JSON.stringify({
              remove_keyboard: true
            }),
          })
          return this.client.sendMessage(chatId, 'Что насчет оплаты? 😄', {
            reply_markup: JSON.stringify({
              inline_keyboard: [
                [{text: 'Оплатить 💳', callback_data: 'pay'}],
                [{text: 'Подумаю 🤪', callback_data: 'think'}],
                [{text: 'Удалить ❌', callback_data: 'delete-order'}],
              ]
            }),
          })
        }

      } catch (e) {
        console.log(e)
      }
    })

    this.client.on('callback_query', async (message) => {
      const data = message.data
      const chatId = message.message.chat.id

      try {
        if (data === '/bye') {
          return this.client.sendMessage(chatId, 'Эхх, ну тогда удачного дня! 🥨')
        }

        if (data === 'next-meet-1') {
          return respondTo(message, this.client)
        }

        if (data === 'changeData') {
          const user = await getMe(chatId);
          if (!user) return this.client.sendMessage(chatId, 'Зарегистрируйся по функции /start 🙂')
          return changeAccountData(message, this.client)
        }

        if (data === 'dontChangeData') {
          return this.client.sendMessage(chatId, 'Хорошо! Тогда перейдем на главную 🚗', botOptions)
        }

        if (data === 'allorders') {
          const orders = await getOrders(chatId);
          if (orders.length < 1) return this.client.sendMessage(chatId, 'Заказов нет', botOptions)
          return this.client.sendMessage(chatId, `Все твои заказы (могут быть не все так как история заказов чистится):\n\n${orders.map(i => {return `ID: ${i.id}\nИмя: ${i.fullname}\nАдрес: ${i.address}\nТелефон: ${i.phoneNumber}\nПожелание: ${i.wish}\nЦена: ${i.price}\nВыполнено: ${i.isComplete ? 'да' : 'нет'}\nОплачено: ${i.isPaid ? 'да' : 'нет'}\n\n`}).join('')}`, {
            reply_markup: JSON.stringify({
              inline_keyboard: [
                [{text: 'Хорошо 👌', callback_data: 'ok'}],
                [{text: 'Удалить все ❌', callback_data: 'delete-orders'}],
              ]
            }),
          })
        }

        if (data === 'ok') {
          return this.client.sendMessage(chatId, 'Хорошо когда хорошо 😊', botOptions)
        }

        if (data === 'pay') {
          const user = await getMe(chatId);
          if (!user) return this.client.sendMessage(chatId, 'Зарегистрируйся по функции /start 🙂')

          return this.client.sendMessage(chatId, 'Оплата в разработке...', botOptions)
        }

        if (data === 'think') {
          return this.client.sendMessage(chatId, 'Хорошо, подумаем! Ну пока перейдем на главную 🚗', botOptions)
        }

        if (data === 'deleteAllReviews') {
          await deleteUserReviews(chatId);
          return this.client.sendMessage(chatId, 'Хорошо, всё удалено! Теперь перейдем на главную 🚗', botOptions)
        }

        if (data === 'deleteOneReview') {
          return deleteReviewFsm(message, this.client)
        }

        if (data === 'delete-orders') {
          const orders = await deleteOrders(chatId);
          if (orders.status === 'error') return this.client.sendMessage(chatId, 'Заказы не найдены 🤷', botOptions)
          return this.client.sendMessage(chatId, 'Удалено все ✅', botOptions)
        }

        if (data === 'delete-order') {
          const order = await deleteOrder(chatId);
          if (order.status === 'error') return this.client.sendMessage(chatId, 'Заказ не найден 🤷', botOptions)
          return this.client.sendMessage(chatId, 'Заказ удален ✅', botOptions)
        }

        if (data === 'gotПРО') {
          await changeUserTariff({chatId: chatId, tariffTitle: 'ПРО'})
          return this.client.sendMessage(chatId, 'Тариф обновлен', botOptions)
        }

        if (data === 'gotСРЕДНИЙ') {
          await changeUserTariff({chatId: chatId, tariffTitle: 'СРЕДНИЙ'})
          return this.client.sendMessage(chatId, 'Тариф обновлен', botOptions)
        }

        if (data === 'gotЭКО') {
          await changeUserTariff({chatId: chatId, tariffTitle: 'ЭКО'})
          return this.client.sendMessage(chatId, 'Тариф обновлен', botOptions)
        }
      } catch (e) {
        console.log(e)
      }
    })
  }
}
