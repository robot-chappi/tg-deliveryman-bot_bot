import StateMachine from 'javascript-state-machine'
import {botOptions} from './keyboards'

function createFsm() {
  return StateMachine.create({
    initial: 'waitingstart',
    final: 'final',
    events: [
      { name: 'gotstart', from: 'waitingstart', to: 'waitinginfo' },
      { name: 'gotinfo', from: 'waitinginfo', to: 'waitingrate' },
      { name: 'gotrate', from: 'waitingrate', to: 'confirm' },
      { name: 'cancelled', from: 'confirm', to: 'waitinginfo'},
      { name: 'cancelledrate', from: 'waitingrate', to: 'waitinginfo'},
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
  case 'waitinginfo':
    return 'gotinfo'
    break
  case 'waitingrate':
    if (text === '1' || text === '2' || text === '3' || text === '4' || text === '5' || text === '6' || text === '7' || text === '8' || text === '9' || text === '10') {
      return 'gotrate'
      break
    }
    return 'cancelledrate'
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

export default async function leaveReview (message, client) {
  try {
    const newMessage = message.message ? message.message : message
    let fsm = createFsm()
    let lastReply = message

    let userId, nickname, review, rate
    let lastMessage

    fsm.ongotstart = () => {
      lastMessage = client.sendMessage(newMessage.chat.id,
        'Ура! Надеюсь мы тебе понравились и ты оставишь хороший отзыв! 😄 \n\nИтак, что ты думаешь о нас? 🤨',
        { reply_markup: JSON.stringify({ force_reply: true }) })
    }

    fsm.ongotinfo = (event, from, to, message) => {
      review = message.text
      userId = message.from.id
      nickname = '@' + message.from.username
      console.log(review, userId, nickname)
      lastMessage = client.sendMessage(message.chat.id,
        'Отлично! А теперь оставь оценку о нас от 1 до 10 😅',
        { reply_markup: JSON.stringify({ force_reply: true})})
    }

    fsm.ongotrate = (event, from, to, message) => {
      rate = Number(message.text)
      console.log(rate)
      lastMessage = client.sendMessage(message.chat.id,
        `Проверь свой отзыв!\nВсе тут верно? 😊\nОтзыв: ${review}\nОценка: ${rate}\n\nВсе верно? (да/нет)`,
        { reply_markup: JSON.stringify({ force_reply: true})})
    }

    fsm.onconfirmed = (event, from, to, message) => {
      lastMessage = client.sendMessage(message.chat.id,
        'Спасибо за отзыв! ❤\nТогда вернемся на главную 🚪', botOptions)
    }

    fsm.oncancelled = (event, from, to, message) => {
      lastMessage = client.sendMessage(message.chat.id,
        'Охх, ну тогда давай перепишем, что ты думаешь о нас? 🙃',
        { reply_markup: JSON.stringify({ force_reply: true }) })
    }

    fsm.oncancelledrate = (event, from, to, message) => {
      lastMessage = client.sendMessage(message.chat.id,
        'Нужно указать было рейтинг от 1 до 10, давай начнем сначала, что ты думаешь о нас? 🙃',
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


