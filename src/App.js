import * as React from 'react';
import './App.scss';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import GroupsIcon from '@mui/icons-material/Groups';
import Button from '@mui/material/Button';
import reducer from './reducer';
import { initState } from './constant';
import { getUsers } from './actions';
import axios from 'axios';
import UserSection from './Components/UserSection';

function App() {
  const [state, dispatch] = React.useReducer(reducer, initState)


  const getUsersReq = async () => {
    try {
      const res = await axios("/api/v1/users/get-all-users")
      if (!res?.data?.success) {
        throw new Error("something went wrong")
      }
      dispatch(getUsers({ data: res.data.data, loading: false, error: false }))
    } catch (error) {
      throw error
    }
  }

  React.useEffect(() => {
    getUsersReq()
    return () => {
    }
  }, [])




  return (
    <>
      <div className="App">
        <div  >
          <h3 style={{ textAlign: "center" }} >
            Users
          </h3>
          <main>
            <UserSection users={state.users.data} />
          </main>

        </div>
        <div  >
          <h3 style={{ textAlign: "center" }} >
            Rooms
          </h3>
        </div>
        <div>
          <Button variant='outlined' startIcon={<PersonAddIcon />}>
            Add New User
          </Button>
          <Button variant='contained' startIcon={<GroupsIcon />}>
            Schedule a meeting
          </Button>
          <Button variant='outlined' startIcon={<MeetingRoomIcon />}>
            Add New Room
          </Button>
        </div>
      </div>

    </>
  );
}

export default App;