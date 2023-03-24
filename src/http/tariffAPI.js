import {$host} from "./index";

export const getTariffItems = async () => {
  const {data} = await $host.get('api/tariff/all')
  return data
}

export const getTariffItem = async (id) => {
  const {data} = await $host.get('api/tariff/' + id)
  return data
}