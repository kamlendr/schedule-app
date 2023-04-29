import { GET_USERS, SHOW_ALERT } from "./constant";

const reducer = (state, action) => {
  switch (action.type) {
    case GET_USERS:
      return { ...state, users: action.payload }
    case SHOW_ALERT:
      return { ...state, alert: action.payload }
    default:
      return state;
  }
}

export default reducer