import React, { useEffect, useState, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { useMutation } from 'react-apollo';
import gql from 'graphql-tag';
import { ReCaptcha } from 'react-recaptcha-google';

const SIGNUP_QUERY = gql`
	mutation SignupQuery(
		$email: String!
		$password: String!
		$phone: String!
		$interest: String!
	) {
		createUser(
			email: $email
			password: $password
			phone: $phone
			interest: $interest
		) {
			user {
				id
			}
		}
	}
`;

export default function () {
	const history = useHistory();

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [phone, setPhone] = useState('');
	const [interest, setInterest] = useState('');

	const [valid, setValid] = useState('');

	const recaptcha = useRef(null);
	const [recaptchaCode, setRecaptchaCode] = useState(null);

	const verifyCallback = function (code) {
		setRecaptchaCode(code);
	};

	const validate = () => {
		if (
			email.length === 0 ||
			password.length < 5 ||
			phone.length !== 10 ||
			interest.length === 0
		) {
			setValid(false);
			return;
		}

		setValid(true);
	};

	useEffect(() => {
		validate();
	}, [email, password, phone, interest]);

	const [signup, { loading, error }] = useMutation(SIGNUP_QUERY, {
		onError: (error) => alert(error),
		onCompleted: () => {
			history.push('/login');
		},
	});

	if (loading) {
		return <h2>loading</h2>;
	}

	return (
		<div>
			<h1>Singup</h1>

			{error && <h2>{error.message}</h2>}

			<form>
				<label htmlFor='email'>
					Email
					<input
						name='email'
						type='email'
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>
				</label>

				<label htmlFor='password'>
					Password
					<input
						name='password'
						type='password'
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
				</label>

				<label htmlFor='phone'>
					Phone
					<input
						name='phone'
						type='tel'
						value={phone}
						onChange={(e) => setPhone(e.target.value)}
					/>
				</label>

				<label htmlFor='interest'>
					Interest
					<input
						name='interest'
						type='text'
						value={interest}
						onChange={(e) => setInterest(e.target.value)}
					/>
				</label>
			</form>

			<div className='button-row-container'>
				<span className='button-row'>
					<button
						className='primary'
						onClick={(e) => {
							e.preventDefault();
							if (recaptchaCode) {
								signup({
									variables: { email, password, phone, interest },
								});
							} else {
								alert('You must verify with the ReCAPTCHA tool');
							}
						}}
						disabled={!valid}
					>
						Signup
					</button>
					<button className='secondary' onClick={() => history.push('/login')}>
						Login
					</button>
				</span>
			</div>

			<ReCaptcha
				ref={recaptcha}
				sitekey='6LcwGeQZAAAAAP6AYnyarMZE239hGgODGNQpFHom'
				badge='inline'
				verifyCallback={verifyCallback}
			/>
		</div>
	);
}
