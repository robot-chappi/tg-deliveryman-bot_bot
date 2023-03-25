import {$host} from "./index";

export const getOrder = async (chatId) => {
  const {data} = await $host.get('api/order/user/' + chatId)
  return data
}

export const getOrders = async (chatId) => {
  const {data} = await $host.get('api/order/user/all/' + chatId)
  return data
}

export const getMealPlan = async (orderId) => {
  const {data} = await $host.get('api/mealplan/user/all/' + orderId)
  return data
}

export const deleteOrder = async (chatId) => {
  const {data} = await $host.delete('api/order/user/' + chatId)
  return data
}

export const deleteOrders = async (chatId) => {
  const {data} = await $host.delete('api/order/user/all/' + chatId)
  return data
}