
export const GET_USERS = "GET_USERS"
export const GET_ROOMS = "GET_ROOMS"
export const SHOW_ALERT = "SHOW_ALERT"
export const MEETING_FORM = "MEETING_FORM"
export const USER_FORM = "USER_FORM"
export const ROOM_FORM = "ROOM_FORM"

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
  alert: { show: false, severity: "success", msg: "hello world" }
}