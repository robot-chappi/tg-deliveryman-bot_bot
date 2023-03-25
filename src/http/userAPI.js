import {$host} from "./index";

export const createUser = async (user) => {
  const {data} = await $host.post('api/user/', user)
  return data
}

export const changeUser = async (user) => {
  const {data} = await $host.patch('api/user/change', user)
  return data
}

export const changeUserTariff = async (user) => {
  const {data} = await $host.patch('api/user/change/tariff', user)
  return data
}

export const getMe = async (chatId) => {
  const {data} = await $host.get('api/user/me/' + chatId)
  return data
}

export const getRoles = async () => {
  const {data} = await $host.get('api/role/all')
  return data
}

export const getFavoriteIngredient = async (userId) => {
  const {data} = await $host.get('api/favoriteingredient/user/all/' + userId)
  return data
}

export const getUnlovedIngredient = async (userId) => {
  const {data} = await $host.get('api/unlovedingredient/user/all/' + userId)
  return data
}

export const getFavoriteProduct = async (userId) => {
  const {data} = await $host.get('api/favoriteproduct/user/all/' + userId)
  return data
}