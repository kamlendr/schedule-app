
export const GET_USERS = "GET_USERS"
export const GET_ROOMS = "GET_ROOMS"
export const SHOW_ALERT = "SHOW_ALERT"

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