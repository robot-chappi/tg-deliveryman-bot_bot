import StateMachine from 'javascript-state-machine'
import {botOptions} from './keyboards'
import {getTariffItems} from '../http/tariffAPI'
import {changeUser, getRoles} from '../http/userAPI'

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

export default async function changeAccountData (message, client) {
  try {
    const newMessage = message.message ? message.message : message
    let fsm = createFsm()
    let lastReply = message

    const chatId = message.message.chat.id
    let name, address, phone, tariffId

    const tariffItems = await getTariffItems();
    const roles = await getRoles();

    let roleId = roles.find(role => role.slug === 'user').id

    let lastMessage

    fsm.ongotstart = () => {
      lastMessage = client.sendMessage(newMessage.chat.id,
        'Хорошо! 😄 \n\nКак тебя зовут? 🤨',
        { reply_markup: JSON.stringify({ force_reply: true }) })
    }

    fsm.ongotname = (event, from, to, message) => {
      name = message.text
      lastMessage = client.sendMessage(message.chat.id,
        `Приятно познакомиться снова, ${name} 🤗\n\nТеперь я бы хотел узнать твой номер телефона чтобы не потерять с тобой связь 😁\n\nЯ записываю...`,
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
        `Ура, теперь я знаю где ты живешь! 😅 На этот адрес буду доставлять только самую лучшую еду - ${address} \n\nА теперь я бы хотел узнать твой тариф, по которому ты бы хотел питаться \n\nВыбери тариф (ID), который тебе больше всего нравится:\n${tariffItems.map((i) => {return `ID: ${i.id}\nНазвание: ${i.title}\nОписание: ${i.description}\nЦена (неделя): ${i.price}\nСкидка на заказ: ${i.discount}\nПривелегии: \n${i.privileges.map((i) => {return `${i.title}\n`}).join('')}\n\n`}).join('')}`,
        { reply_markup: JSON.stringify({ force_reply: true})})
    }

    fsm.ongottariff = (event, from, to, message) => {
      tariffId = message.text
      lastMessage = client.sendMessage(message.chat.id,
        `Ура, теперь я знаю твой любимый тариф! 😅\n\nПодведем итоги: \nИмя: ${name}\nТелефон: ${phone}\nАдрес: ${address}\nТариф: ${tariffId}\n\nВсе верно? (да/нет)`,
        { reply_markup: JSON.stringify({ force_reply: true})})
    }


    fsm.onconfirmed = async (event, from, to, message) => {
      try {
        await changeUser(
          {chatId: String(chatId),
            name: String(name),
            phoneNumber: String(phone),
            address: String(address),
            roleId: Number(roleId),
            tariffId: Number(tariffId)
          })

        lastMessage = client.sendMessage(message.chat.id,
          'Отлично! Тогда давай возвратимся к нашим делам 😊', botOptions)

      } catch (e) {
        client.sendMessage(message.chat.id, 'Какая-то ошибка (может вы ввели имя состоящее из одной буквы - минимум 2), попробуй снова /start')
      }
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


