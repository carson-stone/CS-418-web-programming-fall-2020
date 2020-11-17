import React, { useEffect, useState, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { useMutation } from 'react-apollo';
import gql from 'graphql-tag';
import { loadReCaptcha, ReCaptcha } from 'react-recaptcha-google';

import { useAppContext } from '../../state/AppContext';

const AUTHENTICATE_QUERY = gql`
  mutation AuthenticateQuery($email: String!, $password: String!) {
    tokenAuth(username: $email, password: $password) {
      token
    }
  }
`;

const EMAIL_VERIFIED_QUERY = gql`
  mutation EmailVerifiedQuery($email: String!) {
    isUserVerified(email: $email) {
      verified
    }
  }
`;

export default function () {
  const history = useHistory();

  const { setToken } = useAppContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [valid, setValid] = useState('');

  const [recaptchaCode, setRecaptchaCode] = useState(null);
  const recaptcha = useRef(null);

  const validate = () => {
    if (email.length === 0 || password.length === 0) {
      setValid(false);
      return;
    }

    setValid(true);
  };

  useEffect(() => {
    loadReCaptcha();
  }, []);

  useEffect(() => {
    validate();
  }, [email, password]);

  const [
    seeIfEmailIsVerified,
    { loading: verifyLoading, error: verifyError },
  ] = useMutation(EMAIL_VERIFIED_QUERY);

  const [authenticate, { loading, error }] = useMutation(AUTHENTICATE_QUERY, {
    onError: (error) => alert(error),
    onCompleted: (data) => {
      setToken(data.tokenAuth.token);
      sessionStorage.setItem('token', data.tokenAuth.token);

      history.push('/');
    },
  });

  if (loading || verifyLoading) {
    return <h2>loading</h2>;
  }

  return (
    <div>
      <h1>Login</h1>

      {error && <h2>{error.message}</h2>}
      {verifyError && <h2>{verifyError.message}</h2>}

      <form>
        <label htmlFor='email'>
          Email
          <input
            name='email'
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder='example@email.com'
          />
        </label>

        <label htmlFor='password'>
          Password
          <input
            name='password'
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder='******'
          />
        </label>
      </form>

      <div className='button-row-container'>
        <span className='button-row'>
          <button
            className='primary'
            onClick={(e) => {
              e.preventDefault();
              // if (recaptchaCode) {
              authenticate({
                variables: { email, password },
              });
              // } else {
              //   alert('You must verify with the ReCAPTCHA tool');
              // }
            }}
            disabled={!valid}
          >
            Login
          </button>
          <button
            className='secondary'
            onClick={() => history.push('/recoverpassword')}
          >
            Forgot Password?
          </button>
          <button className='secondary' onClick={() => history.push('/signup')}>
            Signup
          </button>
        </span>
      </div>

      <ReCaptcha
        ref={recaptcha}
        render='explicit'
        sitekey='6LcwGeQZAAAAAP6AYnyarMZE239hGgODGNQpFHom'
        onChange={(token) => alert(token)}
        onErrored={(err) => alert(err)}
        badge='inline'
      />
    </div>
  );
}
