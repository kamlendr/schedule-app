import { GET_ROOMS, GET_USERS, SET_MEETINGS, GET_MEETINGS_FOR_USER, SHOW_ALERT, ADD_MEETINGS } from "./constant";

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

export const addNewMeetings = (payload) => ({
  type: ADD_MEETINGS,
  payload
})
export const getMeetingsForUser = (payload) => ({
  type: GET_MEETINGS_FOR_USER,
  payload
})
export const setMeetingsInRooms = (payload) => ({
  // type: SET_MEETINGS,
  payload
})
