import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import LoadingButton from '@mui/lab/LoadingButton';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Avatar, Button, Chip } from '@mui/material';
import MarkunreadIcon from '@mui/icons-material/Markunread';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { meetingContext } from '../App';
import { showAlert } from '../actions';
import axios from 'axios';

export default function UserSection(props) {
	const { users = [] } = props;
	const { openModal, dispatch } = React.useContext(meetingContext);
	const [isDeleting, setIsDeleting] = React.useState(false);

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

	return (
		<div>
			{users.map((user, i) => {
				const { _id, userId, userName, userEmail } = user ?? {};

				return (
					<Accordion key={_id} defaultExpanded={i === 0}>
						<AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls='panel1a-content' id='panel1a-header'>
							<Typography fontWeight={700}>{userName}</Typography>
						</AccordionSummary>
						<AccordionDetails className='accordion-details'>
							<div className=''>
								<div>
									<AccountCircleIcon /> {userId}
								</div>
								<div>
									<MarkunreadIcon /> {userEmail}
								</div>
							</div>
							<div>
								{true ? (
									<div className='meetings'>
										<div className='date'>25/09/2023</div>
										<div>
											<Chip label='Small' size='small' />
										</div>
										<div className='date'>08/25/2023</div>
										<div className='time'>
											<Chip label='12:35 pm - 02:35 pm' size='small' />
											<Chip label='Small' size='small' />
											<Chip label='Small' size='small' />
											<Chip label='Small' size='small' />
											<Chip label='Small' size='small' />
										</div>
									</div>
								) : (
									'No Meeting Found'
								)}
							</div>
							<div>
								<LoadingButton onClick={() => deleteUser(user.userId)} loading={isDeleting} loadingPosition='start' size='small' variant='outlined' startIcon={<DeleteIcon />}>
									Delete User
								</LoadingButton>
								<Button onClick={() => openModal('user', user)} variant='contained' startIcon={<EditIcon />}>
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
