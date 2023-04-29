import * as React from 'react';
import './App.scss';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import GroupsIcon from '@mui/icons-material/Groups';
import Button from '@mui/material/Button';
import reducer from './reducer';
import { initState } from './constant';

function App() {
  const [state, dispatch] = React.useReducer(reducer, initState)
  
  return (
    <>
      <div className="App">
        <div  >
          <h3 style={{ textAlign: "center" }} >
            Users
          </h3>
          <div>
            user 1
          </div>
          <div>
            user 2
          </div>
          <div>
            user 3
          </div>
          <div>
            user 4
          </div>
          <div>
            user 5
          </div>
          <div>
            user 6
          </div>

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