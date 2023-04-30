import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import dayjs from 'dayjs';
import LoadingButton from '@mui/lab/LoadingButton';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Button, Chip } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { meetingContext } from '../App';
import { showAlert } from '../actions';
import axios from 'axios';
import { ROOM_FORM } from '../constant';

export default function RoomSection() {
	const {
		openModal,
		dispatch,
		state: { rooms },
	} = React.useContext(meetingContext);

	const [isDeleting, setIsDeleting] = React.useState(false);
	const [meetings, setMeetings] = React.useState(false);
	const DEFAULT_OPEN_INDEX = 0;
	const getRoomMeetingsReq = async (roomId) => {
		const options = {
			baseURL: '/api/v1/schedule/get-meetings/room',
			params: {
				roomId,
			},
		};
		try {
			const res = await axios.request(options);
			if (!res?.data?.success) {
				throw new Error(res?.data?.message || 'Something went wrong');
			}
			setMeetings((prev) => ({ ...prev, [roomId]: res.data.data }));
		} catch (error) {
			throw error;
		}
	};

	const deleteRoom = async (id) => {
		setIsDeleting(true);
		try {
			await axios.delete(`/api/v1/room/${id}`);
			dispatch(showAlert({ show: true, severity: 'success', msg: 'Room deleted successsfully' }));
		} catch (error) {
			dispatch(showAlert({ show: true, severity: 'error', msg: error?.response?.data?.message || error.message }));
		} finally {
			setIsDeleting(false);
		}
	};

	React.useEffect(() => {
		const defaultOpenRoomId = rooms?.data?.[DEFAULT_OPEN_INDEX]?.roomId;
		if (defaultOpenRoomId && !meetings[defaultOpenRoomId]) getRoomMeetingsReq(defaultOpenRoomId);
	}, [rooms?.data]);

	return (
		<div>
			{rooms.data.map((room, i) => {
				const { _id, roomId, roomName } = room ?? {};

				return (
					<Accordion onChange={(_, expanded) => expanded && !meetings[roomId] && getRoomMeetingsReq(roomId)} key={_id} defaultExpanded={i === DEFAULT_OPEN_INDEX}>
						<AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls='panel1a-content' id='panel1a-header'>
							<Typography fontWeight={700}>{roomName}</Typography>
						</AccordionSummary>
						<AccordionDetails className='accordion-details'>
							<div style={{ color: 'rgb(134,134,134)' }}>
								<div>
									<LocationOnIcon /> {roomId}
								</div>
							</div>
							<div>
								{!meetings[roomId] ? (
									'Loading'
								) : meetings[roomId].length ? (
									<div className='meetings'>
										{meetings[roomId].map(({ _id, guestRooms, roomId, meetingDate, startTime, endTime }) => (
											<div style={{ display: 'contents' }} key={'hg'}>
												<div className='date'>{dayjs(meetingDate).format('YYYY-MM-DD')}</div>
												<div>
													<Button sx={{ borderRadius: '0px', padding: '0px 6px' }} size='small' color='info' variant='outlined' onClick={() => {}}>
														{`${dayjs(startTime).format('hh:mm a')} - ${dayjs(endTime).format('hh:mm a')}`}
													</Button>
												</div>
											</div>
										))}
									</div>
								) : (
									'No Meeting Found'
								)}
							</div>

							<div>
								<LoadingButton sx={{ borderRadius: '0px', padding: '2px 8px' }} color='error' onClick={() => deleteRoom(room.roomId)} loading={isDeleting} loadingPosition='start' size='small' variant='outlined' startIcon={<DeleteIcon />}>
									Delete Room
								</LoadingButton>
								<Button sx={{ borderRadius: '0px', padding: '2px 8px' }} color='success' size='small' variant='outlined' onClick={() => openModal(ROOM_FORM, room)} startIcon={<EditIcon />}>
									Edit Room
								</Button>
							</div>
						</AccordionDetails>
					</Accordion>
				);
			})}
		</div>
	);
}
