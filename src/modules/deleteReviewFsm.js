import StateMachine from 'javascript-state-machine'
import {botOptions} from './keyboards'
import {createReview, deleteUserReview, getUserReviews} from '../http/reviewAPI'

function createFsm() {
  return StateMachine.create({
    initial: 'waitingstart',
    final: 'final',
    events: [
      { name: 'gotstart', from: 'waitingstart', to: 'waitingreview' },
      { name: 'gotreview', from: 'waitingreview', to: 'confirm' },
      { name: 'cancelled', from: 'confirm', to: 'waitingreview'},
      { name: 'confirmed', from: 'confirm', to: 'final' },
      { name: 'invalid', from: 'confirm', to: 'confirm' },
      { name: 'invalidreview', from: 'waitingreview', to: 'waitingreview' }
    ]
  })
}

function contains(arr, elem) {
  for (var i = 0; i < arr.length; i++) {
    if (arr[i] === elem) {
      return true;
    }
  }
  return false;
}

function eventFromStateAndMessageText(state, text, ids) {
  switch (state) {
  case 'waitingstart':
    return 'gotstart'
    break
  case 'waitingreview':
    if (contains(ids, text)) {
      return 'gotreview'
      break
    }
    return 'invalidreview';
    break
  case 'confirm':
    if (text === 'да') {
      return 'confirmed'
    } else if (text === 'нет') {
      return 'cancelled'
    } else {
      return 'invalid'
    }
  }
}

export default async function deleteReviewFsm (message, client) {
  try {
    const newMessage = message.message ? message.message : message
    let fsm = createFsm()
    let lastReply = message

    const chatId = message.message.chat.id
    let reviewId, reviews, reviewAvaliableIds
    let lastMessage

    reviews = await getUserReviews(chatId);

    reviewAvaliableIds = reviews.map(a => String(a.id));

    fsm.ongotstart = () => {
      if (reviews.length < 1) {
        lastMessage = client.sendMessage(newMessage.chat.id, 'Отзывов нет!', botOptions)
        return lastMessage;
      }
      lastMessage = client.sendMessage(newMessage.chat.id,
        `Итак, какой отзыв будешь удалять? 🤨 (напиши ID своего отзыва)\n\n${reviews.map((i) => {return `ID: ${i.id}\nОтзыв: ${i.text}\nОценка: ${i.mark}/10\nОпубликован: ${i.isChecked ? 'да' : 'нет'}\n\n`}).join('')}`,
        { reply_markup: JSON.stringify({ force_reply: true }) })
    }

    fsm.ongotreview = (event, from, to, message) => {
      try {
        reviewId = Number(message.text)
        deleteUserReview(reviewId, chatId)

        lastMessage = client.sendMessage(message.chat.id,
          `Удалили!\n\nЗакончить? (да/нет)`,
          { reply_markup: JSON.stringify({ force_reply: true})})
      } catch (e) {
        client.sendMessage(message.chat.id, 'Какая-то ошибка (может вы ввели имя состоящее из одной буквы - минимум 2), попробуй снова /reload')
      }
    }

    fsm.onconfirmed = async (event, from, to, message) => {
      lastMessage = client.sendMessage(message.chat.id,
        'Тогда вернемся на главную 🚪', botOptions)
    }

    fsm.oncancelled = (event, from, to, message) => {
      reviews = reviews.filter(x => {
        return x.id !== reviewId;
      })
      if (reviews.length < 1) return client.sendMessage(message.chat.id, 'Больше не осталось отзывов!', botOptions)
      reviewAvaliableIds = reviews.map(a => String(a.id));

      lastMessage = client.sendMessage(message.chat.id,
        `Охх, ну тогда давай еще удалим отзыв 🙃\nВыбирай: (напиши ID своего отзыва)\n\n${reviews.map((i) => {return `ID: ${i.id}\nОтзыв: ${i.text}\nОценка: ${i.mark}/10\nОпубликован: ${i.isChecked ? 'да' : 'нет'}\n\n`}).join('')}`,
        { reply_markup: JSON.stringify({ force_reply: true }) })
    }

    fsm.oninvalid = (event, from, to, message) => {
      lastMessage = client.sendMessage(message.chat.id,
        'Прости, но я написал ответить четко да или нет 🙂\n\nЗакончить? (да/нет)',
        { reply_markup: JSON.stringify({ force_reply: true }) })
    }

    fsm.oninvalidreview = (event, from, to, message) => {
      lastMessage = client.sendMessage(message.chat.id,
        `Ты написал несуществующий ID - выбирай из существующих (напиши ID своего отзыва)\n\n${reviews.map((i) => {return `ID: ${i.id}\nОтзыв: ${i.text}\nОценка: ${i.mark}/10\nОпубликован: ${i.isChecked ? 'да' : 'нет'}\n\n`}).join('')}`,
        { reply_markup: JSON.stringify({ force_reply: true }) })
    }

    while (!fsm.isFinished()) {
      let text = lastReply.text
      let event = eventFromStateAndMessageText(fsm.current, text, reviewAvaliableIds)

      if (!event || fsm.cannot(event)) {
        client.sendMessage(message.message.chat.id, 'Что-то пошло не так, попробуй снова /reload 😩')
        break
      }

      fsm[event](lastReply)

      let sentMessage = await lastMessage
      lastReply = await new Promise(resolve => client.onReplyToMessage(sentMessage.chat.id, sentMessage.message_id, resolve))
    }
  } catch (e) {
    console.log(e)
  }
}


