import { Button, CircularProgress, TextField } from '@mui/material';
import React, { useContext, useState } from 'react';
import { meetingContext } from '../App';
import axios from 'axios';
import { showAlert } from '../actions';

const UserForm = ({ onSuccess }) => {
	const {
		form: { data },
		closeModal,
		dispatch,
		state,
	} = useContext(meetingContext);
	const [fields, setFields] = useState(() => ({ userName: data?.userName ?? '', userEmail: data?.userEmail ?? '', userId: data?.userId ?? '' }));
	const [isLoading, setIsLoading] = useState(false);
	const [errors, setErrors] = useState({});
	const { userName, userEmail, userId } = fields;

	const handleChange = (e) => {
		setErrors({});
		setFields((v) => ({ ...v, [e.target.name]: e.target.value }));
	};

	const validate = () => {
		const err = {};
		if (!userName) {
			err.userName = 'User Name is required';
		}
		if (!userEmail) {
			err.userEmail = 'User Email is required';
		} else if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(userEmail)) {
			err.userEmail = 'Please Enter Valid Email Id';
		}
		if (!userId) {
			err.userId = 'User Id is required';
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
		try {
			await axios.post('/api/v1/users/add-user', fields);
			closeModal();
		} catch (error) {
			dispatch(showAlert({ show: true, severity: 'error', msg: error.response.data.message || error.message }));
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<>
			<div className='user-form'>
				<h4> {data ? 'Edit User Details' : 'Register New User'}</h4>
				<div>
					<TextField error={!!(errors.userName)} onChange={handleChange} value={userName} name='userName' label='Name' />
					<TextField error={!!(errors.userId)} onChange={handleChange} value={userId} name='userId' label='User Id' />
					<TextField error={!!(errors.userEmail)} type='email' onChange={handleChange} value={userEmail} name='userEmail' label='Email' />
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

export default UserForm;
