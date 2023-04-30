import * as React from 'react';
import './App.scss';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import GroupsIcon from '@mui/icons-material/Groups';
import Button from '@mui/material/Button';
import reducer from './reducer';
import Backdrop from '@mui/material/Backdrop';
import { MEETING_FORM, ROOM_FORM, ROOM_TAB, USER_FORM, USER_TAB, initState } from './constant';
import { getRooms, getUsers, showAlert } from './actions';
import axios from 'axios';
import UserSection from './Components/UserSection';
import { Box, Fade, Modal } from '@mui/material';
import UserForm from './Components/UserForm';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import RoomSection from './Components/RoomSection';
import RoomForm from './Components/RoomForm';
import MeetingForm from './Components/MeetingForm';
import useResizeObserver from './Hooks/useResizeObserver';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export const meetingContext = React.createContext()

const defaultTabs = [USER_TAB, ROOM_TAB]
function App() {
  const [state, dispatch] = React.useReducer(reducer, initState)
  const [selectedTabs, setSelectedTabs] = React.useState(defaultTabs)
  const appRef = React.useRef()
  const [formState, setFormState] = React.useState({ show: false, type: '', data: null });
  useResizeObserver(
    {
      element: appRef,
      callback: (entries) => {
        if (entries[0].target.getBoundingClientRect().width < 700) { setSelectedTabs([USER_TAB]) } else {
          setSelectedTabs(defaultTabs)
        }
      }
    }
  )
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
    <meetingContext.Provider value={{ openModal: handleOpen, closeModal: handleClose, form: formState, state, dispatch, getUsersReq, getRoomsReq }} >
      <div ref={appRef} className="App">
        <div>
          <div className='tabs' >
            <h4 onClick={() => window.innerWidth < 700 && setSelectedTabs([USER_TAB])}>Users</h4>
            <h4 onClick={() => window.innerWidth < 700 && setSelectedTabs([ROOM_TAB])}>Rooms</h4>
            <div style={{ transform: selectedTabs.length === 1 ? selectedTabs.includes(USER_TAB) ? "" : "translateX(100%)" : "", background: selectedTabs.length > 1 ? "#00000000" : "" }} className='selection-bar' ></div>
          </div>
        </div>

        <div style={{ gridColumn: selectedTabs.length === 1 && selectedTabs.includes(USER_TAB) ? "1/3" : "", display: !selectedTabs.includes(USER_TAB) ? "none" : "", paddingBottom: "1rem" }} >
          <UserSection />
        </div>
        <div style={{ gridColumn: selectedTabs.length === 1 && selectedTabs.includes(ROOM_TAB) ? "1/3" : "", display: !selectedTabs.includes(ROOM_TAB) ? "none" : "", paddingBottom: "1rem" }} >
          <RoomSection />
        </div>
        <div>
          <Button onClick={() => handleOpen(USER_FORM)} variant='outlined' startIcon={<PersonAddIcon />}>
            New User
          </Button>
          <div onClick={() => handleOpen(MEETING_FORM)} className='meet-btn' >
            <GroupsIcon />
            {false ? "New Meeting" : ""}
          </div>
          <Button onClick={() => handleOpen(ROOM_FORM)} variant='outlined' startIcon={<MeetingRoomIcon />}>
            New Room
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

