
export const GET_USERS = "GET_USERS"
export const GET_ROOMS = "GET_ROOMS"
export const SHOW_ALERT = "SHOW_ALERT"
export const MEETING_FORM = "MEETING_FORM"
export const USER_FORM = "USER_FORM"
export const ROOM_FORM = "ROOM_FORM"
export const USER_TAB = "USER_TAB"
export const ROOM_TAB = "ROOM_TAB"
export const GET_MEETINGS_FOR_USER = "GET_MEETINGS_FOR_USER"
export const UPDATE_MEETINGS = "UPDATE_MEETINGS"

export const initState = {
  users: {
    data: [],
    error: false,
    loading: false
  },
  rooms: {
    data: [],
    error: false,
    loading: false
  },
  roomsToBeUpdated: [],
  usersToBeUpdated: [],
  alert: { show: false, severity: "success", msg: "hello world" }
}