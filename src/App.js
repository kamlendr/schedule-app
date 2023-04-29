import * as React from 'react';
import './App.scss';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import GroupsIcon from '@mui/icons-material/Groups';
import Button from '@mui/material/Button';
import reducer from './reducer';
import Backdrop from '@mui/material/Backdrop';
import { initState } from './constant';
import { getUsers } from './actions';
import axios from 'axios';
import UserSection from './Components/UserSection';
import { Box, Fade, Modal } from '@mui/material';
import UserForm from './Components/UserForm';

export const meetingContext = React.createContext()

function App() {
  const [state, dispatch] = React.useReducer(reducer, initState)
  const [formState, setFormState] = React.useState({ show: false, type: "", data: null });
  const handleOpen = (formType, formData) => setFormState({ show: true, type: formType, data: formData });
  const handleClose = () => setFormState(prev => ({ ...prev, show: false }));

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    // border: '2px solid #000',
    boxShadow: 24,
    // p: 2,
  };



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
    <meetingContext.Provider value={{ openModal: handleOpen, form: formState }} >
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
          <Button onClick={() => handleOpen('user')} variant='outlined' startIcon={<PersonAddIcon />}>
            Add New User
          </Button>
          <Button variant='contained' startIcon={<GroupsIcon />}>
            Schedule a meeting
          </Button>
          <Button variant='outlined' startIcon={<MeetingRoomIcon />}>
            Add New Room
          </Button>
        </div>
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          open={formState.show}
          onClose={handleClose}
          closeAfterTransition
          slots={{ backdrop: Backdrop }}
          slotProps={{
            backdrop: {
              timeout: 500,
            },
          }}
        >
          <Fade in={formState.show}>
            <Box sx={style}>
              <UserForm />
            </Box>
          </Fade>
        </Modal>
      </div>
    </meetingContext.Provider>
  );
}

export default App;