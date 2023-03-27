import {$host} from "./index";

export const createReview = async (review) => {
  const {data} = await $host.post('api/review/', review)
  return data
}

export const getUserReviews = async (chatId) => {
  const {data} = await $host.get('api/review/user/all/' + chatId)
  return data
}

export const deleteUserReview = async (review_id, chat_id) => {
  console.log(review_id, chat_id)
  const {data} = await $host.delete('api/review/user', {params: {review_id: review_id, chat_id: chat_id}})
  return data
}

export const deleteUserReviews = async (chatId) => {
  const {data} = await $host.delete('api/review/user/' + chatId)
  return data
}