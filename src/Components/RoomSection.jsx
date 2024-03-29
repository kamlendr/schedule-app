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
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import { Button, Chip } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { meetingContext } from '../App';
import { showAlert, updateMeetings } from '../actions';
import axios from 'axios';
import { ROOM_FORM } from '../constant';
import { groupByDate } from '../utils/common';

export default function RoomSection() {
	const {
		openModal,
		dispatch,
		state: { rooms, roomsToBeUpdated },
		getRoomsReq,
	} = React.useContext(meetingContext);

	const [isDeleting, setIsDeleting] = React.useState(null);
	const [isLoading, setIsLoading] = React.useState(null);
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
			setIsLoading([roomId]);
			const res = await axios.request(options);
			if (!res?.data?.success) {
				throw new Error(res?.data?.message || 'Something went wrong');
			}
			const data = res.data.data.reduce((acc, val) => {
				const key = dayjs(val.meetingDate).format('YYYY-MM-DD');
				if (acc[key]) {
					acc[key] = [...acc[key], val];
				} else {
					acc[key] = [val];
				}
				return acc;
			}, {});
			setMeetings((prev) => ({ ...prev, [roomId]: data }));
		} catch (error) {
			throw error;
		} finally {
			setIsLoading([]);
		}
	};

	const deleteRoom = async (id) => {
		setIsDeleting(id);
		try {
			await axios.delete(`/api/v1/room/${id}`);
			/*to notify all users who were part of the meeting that was to take place in this room*/
			let guestsInAllMeetings = [];
			for (let key in meetings[id]) {
				meetings[id][key].forEach((v) => {
					guestsInAllMeetings.push(v.guestUsers);
				});
			}
			const uniqueGuests = new Set(guestsInAllMeetings.flat());
			guestsInAllMeetings = Array.from(uniqueGuests);
			dispatch(updateMeetings({ guestUsers: guestsInAllMeetings, roomId: [] }));
			await getRoomsReq();
			dispatch(showAlert({ show: true, severity: 'success', msg: 'Room deleted successsfully' }));
		} catch (error) {
			dispatch(showAlert({ show: true, severity: 'error', msg: error?.response?.data?.message || error.message }));
		} finally {
			setIsDeleting(null);
		}
	};

	React.useEffect(() => {
		const defaultOpenRoomId = rooms?.data?.[DEFAULT_OPEN_INDEX]?.roomId;
		if (defaultOpenRoomId && !meetings[defaultOpenRoomId]) getRoomMeetingsReq(defaultOpenRoomId);
	}, [rooms?.data]);

	React.useEffect(() => {
		// console.log(roomsToBeUpdated);
		const fetchMeetings = roomsToBeUpdated.filter((room) => room in meetings);
		setIsLoading(fetchMeetings);
		axios
			.all(fetchMeetings.map((roomId) => axios.get(`/api/v1/schedule/get-meetings/room?roomId=${roomId}`)))
			.then((res) => {
				let meets = {};
				res.forEach((v) => {
					let roomId = new URL(v.request.responseURL).searchParams.get('roomId');
					meets[roomId] = v.data.data.reduce(groupByDate, {});
				});
				setMeetings((prev) => ({ ...prev, ...meets }));
			})
			.finally(() => setIsLoading([]));
	}, [roomsToBeUpdated]);

	return (
		<div>
			{rooms.data.map((room, i) => {
				const { _id, roomId, roomName } = room ?? {};

				return (
					<Accordion sx={{ borderLeft: '4px solid red' }} onChange={(_, expanded) => expanded && !meetings[roomId] && getRoomMeetingsReq(roomId)} key={_id} defaultExpanded={i === DEFAULT_OPEN_INDEX}>
						<AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls='panel1a-content' id='panel1a-header'>
							<Typography fontWeight={700}>{roomName}</Typography>
						</AccordionSummary>
						<AccordionDetails className='accordion-details'>
							<div style={{ color: 'rgb(134,134,134)' }}>
								<div>
									<LocationOnIcon /> {roomId}
								</div>
								<article>
									{isLoading?.includes?.(roomId) ? (
										<Box sx={{ width: '100%' }}>
											<LinearProgress color='error' />
										</Box>
									) : null}
								</article>
							</div>
							<div>
								{!meetings[roomId] ? (
									'Fetching meeting details...'
								) : Object.keys(meetings[roomId]).length ? (
									<div className='meetings'>
										{Object.entries(meetings[roomId]).map(([key, val]) => {
											return (
												<div style={{ display: 'contents' }} key={key}>
													<div className='date'>{key}</div>
													<div className='timings'>
														{val?.map?.(({ _id, guestUsers, roomId, meetingDate, startTime, endTime }) => (
															<Button key={_id} sx={{ borderRadius: '0px', padding: '0px 6px' }} size='small' color='info' variant='outlined' onClick={() => {}}>
																{`${dayjs(startTime).format('hh:mm a')} - ${dayjs(endTime).format('hh:mm a')}`}
															</Button>
														))}
													</div>
												</div>
											);
										})}
									</div>
								) : (
									'No Meeting Found'
								)}
							</div>

							<div>
								<LoadingButton sx={{ borderRadius: '0px', padding: '2px 8px' }} color='error' onClick={() => deleteRoom(room.roomId)} loading={isDeleting === roomId} loadingPosition='start' size='small' variant='outlined' startIcon={<DeleteIcon />}>
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
