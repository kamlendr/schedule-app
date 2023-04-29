import * as React from 'react';
import './App.scss';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import GroupsIcon from '@mui/icons-material/Groups';
import Button from '@mui/material/Button';
import reducer from './reducer';
import Backdrop from '@mui/material/Backdrop';
import { MEETING_FORM, ROOM_FORM, USER_FORM, initState } from './constant';
import { getRooms, getUsers, showAlert } from './actions';
import axios from 'axios';
import UserSection from './Components/UserSection';
import { Box, Fade, Modal } from '@mui/material';
import UserForm from './Components/UserForm';

import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import RoomSection from './Components/RoomSection';
import RoomForm from './Components/RoomForm';
import MeetingForm from './Components/MeetingForm';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export const meetingContext = React.createContext()

function App() {
  const [state, dispatch] = React.useReducer(reducer, initState)
  const [formState, setFormState] = React.useState({ show: false, type: '', data: null });
  const handleOpen = (formType, formData) => setFormState({ show: true, type: formType, data: formData });
  const handleClose = () => setFormState(prev => ({ ...prev, show: false }));

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    outline: "none",
    boxShadow: 24,
  };



  const getUsersReq = async () => {
    try {
      const res = await axios("/api/v1/users/get-all-users")
      if (!res?.data?.success) {
        throw new Error(res?.data?.message || 'Something went wrong')
      }
      dispatch(getUsers({ data: res.data.data, loading: false, error: false }))
    } catch (error) {
      throw error
    }
  }

  const getRoomsReq = async () => {
    try {
      const res = await axios("/api/v1/room/get-all-rooms")
      if (!res?.data?.success) {
        throw new Error(res?.data?.message || 'Something went wrong')
      }
      dispatch(getRooms({ data: res.data.data, loading: false, error: false }))
    } catch (error) {
      throw error
    }
  }



  React.useEffect(() => {
    getUsersReq()
    getRoomsReq()
  }, [])

  return (
    <meetingContext.Provider value={{ openModal: handleOpen, closeModal: handleClose, form: formState, state, dispatch }} >
      <div className="App">
        <div  >
          <h3 style={{ textAlign: "center" }} >
            Users
          </h3>
          <main>
            <UserSection />
          </main>
        </div>
        <div  >
          <h3 style={{ textAlign: "center" }} >
            Rooms
          </h3>
          <main>
            <RoomSection />
          </main>
        </div>
        <div>
          <Button onClick={() => handleOpen(USER_FORM)} variant='outlined' startIcon={<PersonAddIcon />}>
            Add New User
          </Button>
          <Button onClick={() => handleOpen(MEETING_FORM)} variant='contained' startIcon={<GroupsIcon />}>
            Schedule a meeting
          </Button>
          <Button onClick={() => handleOpen(ROOM_FORM)} variant='outlined' startIcon={<MeetingRoomIcon />}>
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
              {formState.type === USER_FORM ? <UserForm /> : formState.type === ROOM_FORM ? <RoomForm /> : formState.type === MEETING_FORM ? <MeetingForm /> : null}
            </Box>
          </Fade>
        </Modal>
      </div>
      <Snackbar anchorOrigin={{ vertical: "top", horizontal: "center" }} open={state.alert.show} autoHideDuration={3000} onClose={() => dispatch(showAlert({ ...state.alert, show: false }))}>
        <Alert onClose={() => dispatch(showAlert({ ...state.alert, show: false }))} severity={state.alert.severity} sx={{ width: '100%' }}>
          {state.alert.msg}
        </Alert>
      </Snackbar>
    </meetingContext.Provider>
  );
}

export default App;