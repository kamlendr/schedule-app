import { Button, CircularProgress, TextField } from '@mui/material';
import dayjs from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import React, { useContext, useMemo, useState } from 'react';
import { meetingContext } from '../App';
import axios from 'axios';
import { updateMeetings, showAlert } from '../actions';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
	PaperProps: {
		style: {
			maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
			// width: 250,
		},
	},
};

const MeetingForm = ({ onSuccess }) => {
	const {
		closeModal,
		dispatch,
		state: { users },
	} = useContext(meetingContext);
	const [fields, setFields] = useState({ data: { roomId: '', userId: '', meetingDate: dayjs(), startTime: dayjs().add(15, 'minute'), endTime: dayjs().endOf('day'), guestUsers: [] }, errors: {} });
	const [isLoading, setIsLoading] = useState(false);
	const [step, setStep] = useState(1);
	const {
		data: { roomId, userId, meetingDate, startTime, endTime, guestUsers },
		errors,
	} = fields;
	const totalSteps = useMemo(() => (users.data.length > 1 ? 3 : 2), [users.data]);
	const handleChange = (key, val, err = {}) => {
		setFields((prev) => {
			const newFields = { ...prev, data: { ...prev.data, [key]: val } };
			if (err.validationError) {
				newFields['errors'][key] = err.validationError;
			} else {
				delete newFields['errors'][key];
			}
			return newFields;
		});
	};

	const validate = () => {
		let err = {};
		switch (step) {
			case 1:
				if (!userId) {
					err.userId = 'User ID is required';
				}
				if (!roomId) {
					err.roomId = 'Room ID is required';
				}
				break;
			case 2:
				err = Object.fromEntries(Object.entries(errors).filter(([k, v]) => v));
				break;
			default:
				break;
		}
		return err;
	};

	const setErrors = (errs) => {
		setFields((prev) => ({ ...prev, errors: { ...prev.errors, ...errs } }));
	};

	const handleSubmit = async () => {
		setIsLoading(true);

		const payload = {
			...fields.data,
			meetingDate: meetingDate.format('YYYY-MM-DD'),
			endTime: endTime.format('HH:mm'),
			startTime: startTime.format('HH:mm'),
		};

		try {
			const res = await axios.post('api/v1/schedule/create-meeting', payload);
			dispatch(updateMeetings(res.data.data));
			closeModal();
		} catch (error) {
			dispatch(showAlert({ show: true, severity: 'error', msg: error.response.data.message || error.message }));
		} finally {
			setIsLoading(false);
		}
	};

	const handleBackClick = () => {
		if (step === 1) {
			closeModal();
		} else {
			setStep((v) => v - 1);
		}
	};

	const handleNextClick = () => {
		const errs = validate();
		setErrors(errs);
		if (Object.keys(errs).length) {
			return;
		}
		if (step < totalSteps) {
			validate();
			setStep((v) => v + 1);
		} else {
			handleSubmit();
		}
	};

	return (
		<>
			<div className='meeting-form'>
				<h3>Schedule a meeting</h3>
				<div className='stacked'>
					<div style={{ zIndex: step === 1 ? '0' : '-1' }} className='form-fields'>
						<TextField error={!!errors.userId} onChange={(e) => handleChange('userId', e.target.value)} value={userId} label='Host User Id' />
						<TextField error={!!errors.roomId} onChange={(e) => handleChange('roomId', e.target.value)} value={roomId} label='Meeting Room Id' />
					</div>
					<div style={{ zIndex: step === 2 ? '0' : '-1' }} className='form-fields'>
						<LocalizationProvider dateAdapter={AdapterDayjs}>
							<DatePicker
								onAccept={(v) => console.log('accepted')}
								disablePast
								label='Date'
								value={meetingDate}
								onChange={(val, err) => {
									handleChange('meetingDate', val, err);
								}}
							/>
						</LocalizationProvider>
						<LocalizationProvider dateAdapter={AdapterDayjs}>
							<TimePicker
								onError={(v) => setErrors({ startTime: v })}
								disablePast
								label='Start Time'
								maxTime={meetingDate.endOf('day').subtract(15, 'minute')}
								onChange={(v, e) => {
									handleChange('startTime', v, e);
								}}
								value={startTime}
							/>
						</LocalizationProvider>
						<LocalizationProvider dateAdapter={AdapterDayjs}>
							<TimePicker onError={(v) => setErrors({ endTime: v })} disablePast minTime={dayjs(startTime).add(5, 'minute')} maxTime={dayjs(meetingDate).endOf('day')} label='End Time' onChange={(v, e) => handleChange('endTime', v, e)} value={endTime} />
						</LocalizationProvider>
					</div>
					<div style={{ zIndex: step === 3 ? '0' : '-1' }} className='form-fields'>
						<FormControl sx={{ width: '100%' }}>
							<InputLabel id='multiple-checkbox-label'>Invite guests</InputLabel>
							<Select labelId='multiple-checkbox-label' id='multiple-checkbox' multiple value={guestUsers} onChange={(e) => handleChange('guestUsers', e.target.value)} input={<OutlinedInput label='Invite guests' />} renderValue={(selected) => selected.join(', ')} MenuProps={MenuProps}>
								{users.data
									.filter((user) => user.userId !== userId)
									.map((user) => {
										const { _id, userId, userName } = user;
										return (
											<MenuItem key={_id} value={userId}>
												<Checkbox checked={guestUsers.includes(userId)} />
												<ListItemText primary={userName} />
											</MenuItem>
										);
									})}
							</Select>
						</FormControl>
					</div>
				</div>

				<div className='btns'>
					<Button sx={{ marginTop: '0.25rem' }} disabled={isLoading} onClick={handleBackClick} variant='outlined' color='info'>
						Back
					</Button>
					<Button sx={{ marginTop: '0.25rem' }} disabled={isLoading} onClick={handleNextClick} variant='contained' color='success'>
						{step !== totalSteps ? 'Next' : 'Submit'}
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

export default MeetingForm;
