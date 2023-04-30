import * as React from 'react';
import dayjs from 'dayjs';
import Accordion from '@mui/material/Accordion';
import LoadingButton from '@mui/lab/LoadingButton';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Button, Chip } from '@mui/material';
import MarkunreadIcon from '@mui/icons-material/Markunread';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import { meetingContext } from '../App';
import { updateMeetings, showAlert } from '../actions';
import axios from 'axios';
import { USER_FORM } from '../constant';
import { groupByDate } from '../utils/common';

export default function UserSection(props) {
	const {
		openModal,
		dispatch,
		state: { users, usersToBeUpdated },
		getUsersReq,
	} = React.useContext(meetingContext);
	const [isDeleting, setIsDeleting] = React.useState(null);
	const [meetings, setMeetings] = React.useState(false);
	const [isLoading, setIsLoading] = React.useState(null);
	const DEFAULT_OPEN_INDEX = 0;

	const deleteUser = async (id) => {
		setIsDeleting(id);
		try {
			await axios.delete(`/api/v1/users/${id}`);
			/*to notify all users and rooms who will be affected by this user's deletion */

			let guestsInAllMeetings = [];
			let roomsForAllMeetings = [];
			for (let key in meetings[id]) {
				meetings[id][key].forEach((v) => {
					guestsInAllMeetings.push(v.guestUsers);
					roomsForAllMeetings.push(v.roomId);
				});
			}
			const uniqueGuests = new Set(guestsInAllMeetings.flat());
			uniqueGuests.delete(id);
			guestsInAllMeetings = Array.from(uniqueGuests);
			console.log(guestsInAllMeetings);

			dispatch(updateMeetings({ guestUsers: guestsInAllMeetings, roomId: roomsForAllMeetings }));
			await getUsersReq();
			dispatch(showAlert({ show: true, severity: 'success', msg: 'User deleted successsfully' }));
		} catch (error) {
			dispatch(showAlert({ show: true, severity: 'error', msg: error?.response?.data?.message || error.message }));
		} finally {
			setIsDeleting(null);
		}
	};

	const getUserMeetingsReq = async (userId) => {
		const options = {
			baseURL: '/api/v1/schedule/get-meetings/user',
			params: {
				userId,
			},
		};

		try {
			setIsLoading([userId]);
			const res = await axios.request(options);
			const data = res.data.data.reduce(groupByDate, {});
			setMeetings((prev) => ({ ...prev, [userId]: data }));
		} catch (error) {
			throw error;
		} finally {
			setIsLoading([]);
		}
	};

	React.useEffect(() => {
		const defaultOpenUserId = users?.data?.[DEFAULT_OPEN_INDEX]?.userId;
		if (defaultOpenUserId && !meetings[defaultOpenUserId]) getUserMeetingsReq(defaultOpenUserId);
	}, [users?.data]);

	React.useEffect(() => {
		const fetchMeetings = usersToBeUpdated.filter((user) => user in meetings);
		setIsLoading(fetchMeetings);
		axios
			.all(fetchMeetings.map((userId) => axios.get(`/api/v1/schedule/get-meetings/user?userId=${userId}`)))
			.then((res) => {
				let meets = {};
				res.forEach((v) => {
					let userId = new URL(v.request.responseURL).searchParams.get('userId');
					meets[userId] = v.data.data.reduce(groupByDate, {});
				});
				setMeetings((prev) => ({ ...prev, ...meets }));
			})
			.finally(() => setIsLoading([]));
	}, [usersToBeUpdated]);

	return (
		<div>
			{users.data.map((user, i) => {
				const { _id, userId, userName, userEmail } = user ?? {};
				return (
					<Accordion sx={{ borderLeft: '4px solid #0288d1' }} onChange={(_, expanded) => expanded && !meetings[userId] && getUserMeetingsReq(userId)} key={_id} defaultExpanded={i === DEFAULT_OPEN_INDEX}>
						<AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls='panel1a-content' id='panel1a-header'>
							<Typography fontWeight={700}>{userName}</Typography>
						</AccordionSummary>
						<AccordionDetails className='accordion-details'>
							<div style={{ color: 'rgb(134,134,134)' }}>
								<div>
									<AccountCircleIcon /> {userId}
								</div>
								<div>
									<MarkunreadIcon /> {userEmail}
								</div>
								<article>
									{isLoading?.includes?.(userId) ? (
										<Box sx={{ width: '100%' }}>
											<LinearProgress />
										</Box>
									) : null}
								</article>
							</div>
							<div>
								{!meetings[userId] ? (
									'Fetching meeting details...'
								) : Object.keys(meetings[userId]).length ? (
									<div className='meetings'>
										{Object.entries(meetings[userId]).map(([key, val]) => {
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
								<LoadingButton sx={{ borderRadius: '0px', padding: '2px 8px' }} size='small' color='error' onClick={() => deleteUser(user.userId)} loading={isDeleting === userId} loadingPosition='start' variant='outlined' startIcon={<DeleteIcon />}>
									Delete User
								</LoadingButton>
								<Button sx={{ borderRadius: '0px', padding: '2px 8px' }} size='small' color='success' variant='outlined' onClick={() => openModal(USER_FORM, user)} startIcon={<EditIcon />}>
									Edit User
								</Button>
							</div>
						</AccordionDetails>
					</Accordion>
				);
			})}
		</div>
	);
}
