import * as React from 'react';
import Accordion from '@mui/material/Accordion';
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

export default function RoomSection(props) {
	// const { users: rooms = [] } = props;
	const {
		openModal,
		dispatch,
		state: { rooms },
	} = React.useContext(meetingContext);

	const [isDeleting, setIsDeleting] = React.useState(false);

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

	return (
		<div>
			{rooms.data.map((room, i) => {
				const { _id, roomId, roomName } = room ?? {};

				return (
					<Accordion key={_id} defaultExpanded={i === 0}>
						<AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls='panel1a-content' id='panel1a-header'>
							<Typography fontWeight={700}>{roomName}</Typography>
						</AccordionSummary>
						<AccordionDetails className='accordion-details'>
							<div className=''>
								<div>
									<LocationOnIcon /> {roomId}
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
								<LoadingButton onClick={() => deleteRoom(room.roomId)} loading={isDeleting} loadingPosition='start' size='small' variant='outlined' startIcon={<DeleteIcon />}>
									Delete Room
								</LoadingButton>
								<Button onClick={() => openModal(ROOM_FORM, room)} variant='contained' startIcon={<EditIcon />}>
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
