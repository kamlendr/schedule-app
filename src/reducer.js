import { GET_ROOMS, GET_USERS, SHOW_ALERT, ADD_MEETINGS } from "./constant";
const reducer = (state, action) => {
  switch (action.type) {
    case GET_USERS:
      return { ...state, users: action.payload }
    case GET_ROOMS:
      return { ...state, rooms: action.payload }
    case SHOW_ALERT:
      return { ...state, alert: action.payload }
    case ADD_MEETINGS:
      const meeting = action.payload;
      // const usersToBeUpdated = meeting.guestUsers.filter(user => user in state.meetingsForUsers)
      return {
        ...state, usersToBeUpdated: meeting.guestUsers, roomToBeUpdated: meeting.roomId
      }
    default:
      return state;
  }
}

export default reducer