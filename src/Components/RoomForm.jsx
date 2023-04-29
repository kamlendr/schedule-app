import { Button, CircularProgress, TextField } from '@mui/material';
import React, { useContext, useState } from 'react';
import { meetingContext } from '../App';
import axios from 'axios';
import { showAlert } from '../actions';

const RoomForm = ({ onSuccess }) => {
	const {
		form: { data },
		closeModal,
		dispatch,
		state,
	} = useContext(meetingContext);
	const [fields, setFields] = useState(() => ({ roomName: data?.roomName ?? '' }));
	const [isLoading, setIsLoading] = useState(false);
	const [errors, setErrors] = useState({});
	const { roomName, roomId } = fields;
	const isEditForm = Boolean(data?.roomId);

	const handleChange = (e) => {
		setErrors({});
		setFields((v) => ({ ...v, [e.target.name]: e.target.value }));
	};

	const validate = () => {
		const err = {};
		if (!roomName) {
			err.roomName = 'Room Name is required';
		}
		if (!isEditForm && !roomId) {
			err.roomId = 'Room Id is required';
		}
		return err;
	};

	const handleSubmit = async () => {
		const errs = validate();
		setErrors(errs);
		if (Object.keys(errs).length) {
			return;
		}
		setIsLoading(true);
		const options = {
			method: isEditForm ? 'PUT' : 'POST',
			url: isEditForm ? data.roomId : '/add-room',
			baseURL: '/api/v1/room',
			data: fields,
		};

		try {
			await axios.request(options);
			closeModal();
		} catch (error) {
			dispatch(showAlert({ show: true, severity: 'error', msg: error.response.data.message || error.message }));
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<>
			<div className='room-form'>
				<h4> {data ? 'Edit Room Details' : 'Add New Room'}</h4>
				<div>
					<TextField error={!!errors.roomName} onChange={handleChange} value={roomName} name='roomName' label='Name' />
					{!isEditForm ? <TextField error={!!errors.roomId} onChange={handleChange} value={roomId} name='roomId' label='Room Id' /> : null}
					<Button sx={{ marginTop: '0.25rem' }} disabled={isLoading} onClick={handleSubmit} variant='contained' color='success'>
						{data ? 'Update' : 'Submit'}
					</Button>
				</div>
				{isLoading ? (
					<div className='busy-overlay'>
						<CircularProgress />
					</div>
				) : null}
			</div>
		</>
	);
};

export default RoomForm;
