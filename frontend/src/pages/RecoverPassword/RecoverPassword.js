import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useMutation } from 'react-apollo';
import gql from 'graphql-tag';

const CAN_RECOVER_PASSWORD_QUERY = gql`
  mutation CanRecoverPasswordQuery($email: String!, $phone: String!) {
    canRecoverPassword(email: $email, phone: $phone) {
      status
    }
  }
`;

const UPDATE_PASSWORD_MUTATION = gql`
  mutation UpdatePasswordMutation($email: String!, $password: String!) {
    recoverPassword(email: $email, password: $password) {
      email
    }
  }
`;

export default function () {
  const history = useHistory();

  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const [canRecoverPassword, setCanRecoverPassword] = useState(false);
  const [valid, setValid] = useState(false);

  const validate = () => {
    if (email.length === 0 || phone.length !== 10) {
      setValid(false);
      return;
    }

    setValid(true);
  };

  useEffect(() => {
    validate();
  }, [phone, email]);

  const [sendRecoverPossibleRequest, { loading, error }] = useMutation(
    CAN_RECOVER_PASSWORD_QUERY,
    {
      variables: { email, phone },
      onError: (error) => alert(error),
      onCompleted: (data) => {
        if (data.canRecoverPassword.status == true) setCanRecoverPassword(true);
      },
    }
  );

  const [
    updatePassword,
    { loading: passwordLoading, error: passwordError },
  ] = useMutation(UPDATE_PASSWORD_MUTATION, {
    onError: (error) => alert(error),
    onCompleted: () => {
      history.push('/login');
    },
  });

  if (loading || passwordLoading) {
    return <h2>loading</h2>;
  }

  return (
    <div>
      <h1>Password Reset</h1>

      {error && <h2>{error.message}</h2>}
      {passwordError && <h2>{passwordError.message}</h2>}

      {!canRecoverPassword && (
        <>
          <form>
            <h3>
              Please enter your email and phone number to reset your password.
            </h3>
            <div className='form-row'>
              <label htmlFor='phone'>Phone</label>
              <input
                placeholder='phone #'
                value={phone}
                type='tel'
                name='phone'
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div className='form-row'>
              <label htmlFor='email'>Email</label>
              <input
                placeholder='example@email.com'
                value={email}
                type='email'
                name='email'
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </form>

          <div className='button-row-container'>
            <span className='button-row'>
              <button
                className='primary'
                onClick={() =>
                  sendRecoverPossibleRequest({
                    variables: {
                      phone,
                      email,
                    },
                  })
                }
                disabled={!valid}
              >
                Send
              </button>
              <button
                className='secondary'
                onClick={() => history.push('/login')}
              >
                Cancel
              </button>
            </span>
          </div>
        </>
      )}

      {canRecoverPassword && (
        <>
          <form>
            <div className='form-row' id='password-row'>
              <label>Password</label>
              <input
                placeholder='******'
                value={password}
                type='password'
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </form>

          <div className='button-row-container'>
            <span className='button-row'>
              <button
                className='primary'
                onClick={() =>
                  updatePassword({
                    variables: {
                      email,
                      password,
                    },
                  })
                }
                disabled={!valid}
              >
                Confirm
              </button>
              <button
                className='secondary'
                onClick={() => history.push('/login')}
              >
                Cancel
              </button>
            </span>
          </div>
        </>
      )}
    </div>
  );
}
