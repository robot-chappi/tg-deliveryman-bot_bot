import {$host} from "./index";

export const createUser = async (user) => {
  const {data} = await $host.post('api/user/', user)
  return data
}