import * as React from 'react';
import Accordion from '@mui/material/Accordion';
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

export default function UserSection(props) {
	const { users = [] } = props;
	const { openModal } = React.useContext(meetingContext);

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
								<Button size='small' variant='outlined' startIcon={<DeleteIcon />}>
									Delete User
								</Button>
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
