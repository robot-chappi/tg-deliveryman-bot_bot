import TelegramBotClient from 'node-telegram-bot-api'
import StateMachine from 'javascript-state-machine'
import respondTo from './modules/registration'
import {STORE} from './modules/variables'
import changeAccountData from './modules/changeAccountData'
import {botOptions} from './modules/keyboards'
import leaveReview from './modules/leaveReview'
// import sequelize from '../db/db'
const sequelize = require('../db/db')
const models = require('../db/models/models')

export default class Bot {
  constructor(token) {
    this.client = new TelegramBotClient(token, { polling: true })
    this.website = STORE
  }

  async start() {

    try {
      await sequelize.authenticate()
      await sequelize.sync()
    } catch (e) {
      console.log('Подключение к DB сломалось', e)
    }

    this.client.on('message', async (message) => {
      const chatId = message.chat.id
      const text = message.text
      const user = {name: 'Иван Иванов Иванович', phone: '+79201563122', address: 'Россия, Московская обл., Москва, ул. Пушкина, д. 20'}
      const order = {tariff: 'Эко', category: 'Правильное питание', food: {
        monday: [
          {name: 'Пицца', price: 150, quantity: 1}, {name: 'Роллы', price: 200, quantity: 1}, {name: 'Печенье', price: 250, quantity: 1}
        ],
        tuesday: [
          {name: 'Каша', price: 150, quantity: 1}, {name: 'Роллы', price: 200, quantity: 1}, {name: 'Печенье', price: 250, quantity: 1}
        ],
        wednesday: [
          {name: 'Суп', price: 150, quantity: 1}, {name: 'Роллы', price: 200, quantity: 1}, {name: 'Печенье', price: 250, quantity: 1}
        ],
        thursday: [
          {name: 'Салат', price: 150, quantity: 1}, {name: 'Роллы', price: 200, quantity: 1}, {name: 'Печенье', price: 250, quantity: 1}
        ],
        friday: [
          {name: 'Яблоко', price: 150, quantity: 1}, {name: 'Роллы', price: 200, quantity: 1}, {name: 'Печенье', price: 250, quantity: 1}
        ],
        saturday: [
          {name: 'Груша', price: 150, quantity: 1}, {name: 'Роллы', price: 200, quantity: 1}, {name: 'Печенье', price: 250, quantity: 1}
        ],
        sunday: [
          {name: 'Апельсин', price: 150, quantity: 1}, {name: 'Роллы', price: 200, quantity: 1}, {name: 'Печенье', price: 250, quantity: 1}
        ]
      }, full_price_per_month: 2000, payment: 0}
      const tariff = [
        {name: 'ПРО 🥇', description: '', features: [
            {text: 'Быстрая доставка'},
            {text: 'Личный куратор по еде'},
            {text: 'Что-то еще...'},
            {text: 'Что-то еще...'},
        ], price_per_month: 3000},
        {name: 'СРЕДНИЙ 🥈', description: '', features: [
            {text: 'Быстрая доставка'},
            {text: 'Куратор по еде'},
            {text: 'Что-то еще...'},
            {text: 'Что-то еще...'},
        ], price_per_month: 1000},
        {name: 'ЭКО 🥉', description: '', features: [
            {text: 'Что-то еще...'},
            {text: 'Что-то еще...'},
            {text: 'Что-то еще...'},
            {text: 'Что-то еще...'},
        ], price_per_month: 500}
      ]

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

        if (text === 'Открыть магазин 🛍') {
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
          return leaveReview(message, this.client)
        }

        if (text === 'Аккаунт 📃') {
          await this.client.sendMessage(chatId, `Данные о тебе: 📰\n\nИмя: ${user.name}\nТелефон: ${user.phone}\nАдрес: ${user.address}`, {
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
          return this.client.sendMessage(chatId, `${tariff.map(i => {
            return `Тариф ${i.name}\nИнформация: ${i.description}\nПреимущества: \n${i.features.map(f => {
              return `⚫ ${f.text}\n`
            }).join('')}\n\nЦена: ${i.price_per_month} руб.\n\n`
          }).join('')}`, {
            reply_markup: JSON.stringify({
              inline_keyboard: [
                [{text: 'Подключить ПРО 🥇', callback_data: 'gotopro'}],
                [{text: 'Подключить СРЕДНИЙ 🥈', callback_data: 'gotoaverage'}],
                [{text: 'Подключить ЭКО 🥉', callback_data: 'gotoeco'}],
              ]
            }),
          })
        }

        if (text === 'Информация о компании 📈') {
          return this.client.sendMessage(chatId, `Мы доставляем еду каждый день и решаем сразу несколько проблем 🤜\n\n1. Не нужно думать чего бы поесть утром/днем/вечером 😊\n2. Не нужно тратить время на готовку 👀\n3. Не нужно уметь готовить, чтобы вкусно поесть 😬\n\nПожалуй это все 😎`)
        }

        if (text === 'Мои заказы 💵') {
          await this.client.sendMessage(chatId, `Твой тариф: ${order.tariff} ${order.tariff === 'Про' ? '🥇' : order.tariff === 'Средний' ? '🥈' : '🥉'}\n\nКатегория: ${order.category}\n\nБлюда: \n\nПонедельник: \n${order.food.monday.map(i => {
            return `${i.name + ' | ' + i.price + 'руб.' + ' | ' + i.quantity} \n`
          }).join('')}\nВторник: \n${order.food.tuesday.map(i => {
            return `${i.name + ' | ' + i.price + 'руб.' + ' | ' + i.quantity} \n`
          }).join('')}\nСреда: \n${order.food.wednesday.map(i => {
            return `${i.name + ' | ' + i.price + 'руб.' + ' | ' + i.quantity} \n`
          }).join('')}\nЧетверг: \n${order.food.thursday.map(i => {
            return `${i.name + ' | ' + i.price + 'руб.' + ' | ' + i.quantity} \n`
          }).join('')}\nПятница: \n${order.food.friday.map(i => {
            return `${i.name + ' | ' + i.price + 'руб.' + ' | ' + i.quantity} \n`
          }).join('')}\nСуббота: \n${order.food.saturday.map(i => {
            return `${i.name + ' | ' + i.price + 'руб.' + ' | ' + i.quantity} \n`
          }).join('')}\nВоскресенье: \n${order.food.sunday.map(i => {
            return `${i.name + ' | ' + i.price + 'руб.' + ' | ' + i.quantity} \n`
          }).join('')}\n\nВ месяц: ${order.full_price_per_month} руб.\nОплата: ${order.payment === 1 ? 'Оплачен' : 'Не оплачен'}\n
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
          return changeAccountData(message, this.client)
        }

        if (data === 'dontChangeData') {
          return this.client.sendMessage(chatId, 'Хорошо! Тогда перейдем на главную 🚗', botOptions)
        }

        if (data === 'pay') {
          return this.client.sendMessage(chatId, 'Оплата в разработке...', botOptions)
        }

        if (data === 'think') {
          return this.client.sendMessage(chatId, 'Хорошо, подумаем! Ну пока перейдем на главную 🚗', botOptions)
        }

        if (data === 'delete-order') {
          return this.client.sendMessage(chatId, 'Удаляем... Что насчет нового заказа? 🍨', botOptions)
        }

        if (data === 'gotopro') {
          return this.client.sendMessage(chatId, 'В разработке...', botOptions)
        }

        if (data === 'gotoaverage') {
          return this.client.sendMessage(chatId, 'В разработке...', botOptions)
        }

        if (data === 'gotoeco') {
          return this.client.sendMessage(chatId, 'В разработке...', botOptions)
        }
      } catch (e) {
        console.log(e)
      }
    })
  }
}
