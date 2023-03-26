import {$host} from "./index";

export const createReview = async (review) => {
  const {data} = await $host.post('api/review/', review)
  return data
}

export const getUserReviews = async (chatId) => {
  const {data} = await $host.get('api/review/user/all/' + chatId)
  return data
}

export const deleteUserReview = async (review) => {
  const {data} = await $host.delete('api/review/user/', review)
  return data
}

export const deleteUserReviews = async (chatId) => {
  const {data} = await $host.delete('api/review/user/' + chatId)
  return data
}