import { GET_ROOMS, GET_USERS, SHOW_ALERT } from "./constant";

export const getUsers = (payload) => ({
  type: GET_USERS,
  payload
})
export const getRooms = (payload) => ({
  type: GET_ROOMS,
  payload
})
export const showAlert = (payload) => ({
  type: SHOW_ALERT,
  payload
})
