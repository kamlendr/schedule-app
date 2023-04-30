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
import { meetingContext } from '../App';
import { showAlert } from '../actions';
import axios from 'axios';
import { USER_FORM } from '../constant';

export default function UserSection(props) {
	const {
		openModal,
		dispatch,
		state: { users },
	} = React.useContext(meetingContext);
	const [isDeleting, setIsDeleting] = React.useState(false);
	const [meetings, setMeetings] = React.useState(false);
	const DEFAULT_OPEN_INDEX = 0;

	const deleteUser = async (id) => {
		setIsDeleting(true);
		try {
			await axios.delete(`/api/v1/users/${id}`);
			dispatch(showAlert({ show: true, severity: 'success', msg: 'User deleted successsfully' }));
		} catch (error) {
			dispatch(showAlert({ show: true, severity: 'error', msg: error?.response?.data?.message || error.message }));
		} finally {
			setIsDeleting(false);
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
			console.log(data);

			setMeetings((prev) => ({ ...prev, [userId]: data }));
		} catch (error) {
			throw error;
		}
	};

	React.useEffect(() => {
		const defaultOpenUserId = users?.data?.[DEFAULT_OPEN_INDEX]?.userId;
		if (defaultOpenUserId && !meetings[defaultOpenUserId]) getUserMeetingsReq(defaultOpenUserId);
	}, [users?.data]);

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
							</div>
							<div>
								{!meetings[userId] ? (
									'Loading'
								) : Object.keys(meetings[userId]).length ? (
									<div className='meetings'>
										{Object.entries(meetings[userId]).map(([key, val]) => {
											return (
												<div style={{ display: 'contents' }} key={key}>
													<div className='date'>{key}</div>
													<div className='timings' >
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
								<LoadingButton sx={{ borderRadius: '0px', padding: '2px 8px' }} size='small' color='error' onClick={() => deleteUser(user.userId)} loading={isDeleting} loadingPosition='start' variant='outlined' startIcon={<DeleteIcon />}>
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
