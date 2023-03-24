import {$host} from "./index";

export const getOrder = async (order) => {
  const {data} = await $host.get('api/order', order)
  return data
}

export const deleteOrder = async (order) => {
  const {data} = await $host.delete('api/order', order)
  return data
}