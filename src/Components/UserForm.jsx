import { Button, CircularProgress, TextField } from '@mui/material';
import React, { useContext, useState } from 'react';
import { meetingContext } from '../App';

const UserForm = ({ onSuccess }) => {
	const {
		form: { data },
	} = useContext(meetingContext);
	const [fields, setFields] = useState(() => ({ userName: data?.userName ?? '', userEmail: data?.userEmail ?? '', userId: data?.userId ?? '' }));
	const { userName, userEmail, userId } = fields;

	const handleChange = (e) => {
		setFields((v) => ({ ...v, [e.target.name]: e.target.value }));
	};

	const handleSubmit = async () => {
		const headers = new Headers({
			'Content-Type': 'application/json',
		});
		try {
			const res = fetch('', { headers, body: JSON.stringify(fields), method: 'post' });
		} catch (error) {}
	};

	return (
		<>
			<div className='user-form'>
				<h4> {data ? 'Edit User Details' : 'Register New User'}</h4>
				<div>
					<TextField onChange={handleChange} value={userName} name='userName' label='Name' />
					<TextField onChange={handleChange} value={userId} name='userId' label='User Id' />
					<TextField type='email' onChange={handleChange} value={userEmail} name='userEmail' label='Email' />
					<Button disabled={!Boolean(userName && userEmail && userId)} onClick={handleSubmit} variant='contained' color='success'>
						{data ? 'Update' : 'Submit'}
					</Button>
				</div>
				{false ? (
					<div className='busy-overlay'>
						<CircularProgress />
					</div>
				) : null}
			</div>
		</>
	);
};

export default UserForm;
