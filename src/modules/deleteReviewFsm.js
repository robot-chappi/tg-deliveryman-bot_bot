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
      { name: 'cancelled', from: 'confirm', to: 'waitinginfo'},
      { name: 'confirmed', from: 'confirm', to: 'final' },
      { name: 'invalid', from: 'confirm', to: 'confirm' }
    ]
  })
}

function eventFromStateAndMessageText(state, text) {
  switch (state) {
  case 'waitingstart':
    return 'gotstart'
    break
  case 'waitingreview':
    return 'gotreview'
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
    let reviewId, rate
    let lastMessage

    fsm.ongotstart = async () => {
      const reviews = await getUserReviews(chatId);
      lastMessage = client.sendMessage(newMessage.chat.id,
        `Итак, какой отзыв будешь удалять? 🤨 (напиши ID своего отзыва)\n\n${reviews.map((i) => {return `ID: ${i.id}\nОтзыв: ${i.text}\nОценка: ${i.mark}/10\nОпубликован: ${i.isChecked ? 'да' : 'нет'}\n\n`}).join('')}`,
        { reply_markup: JSON.stringify({ force_reply: true }) })
    }

    fsm.ongotreview = async (event, from, to, message) => {
      reviewId = Number(message.text)
      await deleteUserReview({review_id: reviewId, chatId: chatId})
      lastMessage = client.sendMessage(message.chat.id,
        `Удалили!\n\nЗакончить? (да/нет)`,
        { reply_markup: JSON.stringify({ force_reply: true})})
    }

    fsm.onconfirmed = async (event, from, to, message) => {
      await createReview({text: review, mark: rate, chatId: chatId, isChecked: false})
      lastMessage = client.sendMessage(message.chat.id,
        'Тогда вернемся на главную 🚪', botOptions)
    }

    fsm.oncancelled = (event, from, to, message) => {
      lastMessage = client.sendMessage(message.chat.id,
        `Охх, ну тогда давай еще удалим отзыв 🙃\nВыбирай: (напиши ID своего отзыва)\n\n${reviews.map((i) => {return `ID: ${i.id}\nОтзыв: ${i.text}\nОценка: ${i.mark}/10\nОпубликован: ${i.isChecked ? 'да' : 'нет'}\n\n`}).join('')}`,
        { reply_markup: JSON.stringify({ force_reply: true }) })
    }

    fsm.oninvalid = (event, from, to, message) => {
      lastMessage = client.sendMessage(message.chat.id,
        'Прости, но я написал ответить четко да или нет 🙂\n\n Все верно? (да/нет)',
        { reply_markup: JSON.stringify({ force_reply: true }) })
    }

    while (!fsm.isFinished()) {
      let text = lastReply.text
      let event = eventFromStateAndMessageText(fsm.current, text)

      if (!event || fsm.cannot(event)) {
        client.sendMessage(message.message.chat.id, 'Что-то пошло не так, попробуй снова /start 😩')
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


