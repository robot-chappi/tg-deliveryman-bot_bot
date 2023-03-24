import StateMachine from 'javascript-state-machine'
import {botOptions} from './keyboards'
import {getTariffItems} from '../http/tariffAPI'

function createFsm() {
  return StateMachine.create({
    initial: 'waitingstart',
    final: 'final',
    events: [
      { name: 'gotstart', from: 'waitingstart', to: 'waitingname' },
      { name: 'gotname', from: 'waitingname', to: 'waitingphone' },
      { name: 'gotphone', from: 'waitingphone', to: 'waitingaddress' },
      { name: 'gotaddress', from: 'waitingaddress', to: 'waitingtariff'},
      { name: 'gottariff', from: 'waitingtariff', to: 'confirm'},
      { name: 'cancelled', from: 'confirm', to: 'waitingname'},
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
  case 'waitingname':
    return 'gotname'
    break
  case 'waitingphone':
    return 'gotphone'
    break
  case 'waitingaddress':
    return 'gotaddress'
    break
  case 'waitingtariff':
    return 'gottariff'
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

export default async function respondTo (message, client) {
  try {
    const newMessage = message.message ? message.message : message
    let fsm = createFsm()
    let lastReply = message

    let name, address, phone, tariffId
    const chatId = message.message.chat.id
    const tariffItems = await getTariffItems();
    let lastMessage

    fsm.ongotstart = () => {
      lastMessage = client.sendMessage(newMessage.chat.id,
        'Ура! Тогда давай знакомиться 😄 \n\nКак тебя зовут? 🤨',
        { reply_markup: JSON.stringify({ force_reply: true }) })
    }

    fsm.ongotname = (event, from, to, message) => {
      name = message.text
      lastMessage = client.sendMessage(message.chat.id,
        `Приятно познакомиться, ${name} 🤗\n\nТеперь я бы хотел узнать твой номер телефона чтобы не потерять с тобой связь 😁\n\nЯ записываю...`,
        { reply_markup: JSON.stringify({ force_reply: true }) })
    }

    fsm.ongotphone = (event, from, to, message) => {
      phone = message.text
      lastMessage = client.sendMessage(message.chat.id,
        `Отлично, в случае чего позвоню на этот номер ${phone} 😉\n\nА теперь я бы хотел узнать твой адрес, чтобы доставлять еду прямо к тебе домой! \n\nЗаписываю...`,
        { reply_markup: JSON.stringify({ force_reply: true }) })
    }

    fsm.ongotaddress = (event, from, to, message) => {
      address = message.text
      lastMessage = client.sendMessage(message.chat.id,
        `Ура, теперь я знаю где ты живешь! 😅 На этот адрес буду доставлять только самую лучшую еду - ${address} \n\nА теперь я бы хотел узнать твой тариф, по которому ты бы хотел питаться \n\n Выбери тариф, который тебе больше всего нравится:\n`,
        { reply_markup: JSON.stringify({ force_reply: true})})
    }

    fsm.ongottariff = (event, from, to, message) => {
      address = message.text
      lastMessage = client.sendMessage(message.chat.id,
        `Ура, теперь я знаю где ты живешь! 😅 На этот адрес буду доставлять только самую лучшую еду - ${address} \n\nПодведем итоги: \nИмя: ${name}\nТелефон: ${phone}\nАдрес: ${address}\n\nВсе верно? (да/нет)`,
        { reply_markup: JSON.stringify({ force_reply: true})})
    }


    fsm.onconfirmed = (event, from, to, message) => {
      // const response
      lastMessage = client.sendMessage(message.chat.id,
        'Отлично! Тогда прошу взглянуть на клавиатуру, там ты можешь заказать себе вкусную еду и опробовать мой функционал! 😊', botOptions)
    }

    fsm.oncancelled = (event, from, to, message) => {
      lastMessage = client.sendMessage(message.chat.id,
        'Охх, ну тогда давай сначала, как тебя зовут? 🙃',
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


