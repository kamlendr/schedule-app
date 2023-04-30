import { GET_ROOMS, GET_USERS, SHOW_ALERT, UPDATE_MEETINGS } from "./constant";

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

export const updateMeetings = (payload) => ({
  type: UPDATE_MEETINGS,
  payload
})