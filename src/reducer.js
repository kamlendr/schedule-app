import { GET_ROOMS, GET_USERS, SHOW_ALERT, UPDATE_MEETINGS } from "./constant";
const reducer = (state, action) => {
  switch (action.type) {
    case GET_USERS:
      return { ...state, users: action.payload }
    case GET_ROOMS:
      return { ...state, rooms: action.payload }
    case SHOW_ALERT:
      return { ...state, alert: action.payload }
    case UPDATE_MEETINGS:
      const meeting = action.payload;
      return {
        ...state, usersToBeUpdated: meeting.guestUsers, roomsToBeUpdated: [meeting.roomId].flat()
      }
    default:
      return state;
  }
}

export default reducer