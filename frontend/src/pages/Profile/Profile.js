import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useMutation } from 'react-apollo';
import gql from 'graphql-tag';

import { useAppContext } from '../../state/AppContext';

const UPDATE_PROFILE_MUTATION = gql`
  mutation UpdateProfileQuery($phone: String!, $interest: String!) {
    updateProfile(phone: $phone, interest: $interest) {
      phone
      interest
    }
  }
`;

const UPDATE_PASSWORD_MUTATION = gql`
  mutation UpdatePasswordMutation($password: String!) {
    changePassword(password: $password) {
      email
    }
  }
`;

export default function () {
  const history = useHistory();
  const { user, setUser, setToken } = useAppContext();

  const [phone, setPhone] = useState(user ? user.phone : '');
  const [interest, setInterest] = useState(user ? user.interest : '');
  const [password, setPassword] = useState('');

  const [valid, setValid] = useState(false);
  const [editing, setEditing] = useState(false);
  const [updatingPassword, setUpdatingPassword] = useState(false);

  const validate = () => {
    if (user) {
      if (updatingPassword && password.length < 5) {
        setValid(false);
        return;
      }

      if (updatingPassword && password.length >= 5) {
        setValid(true);
        return;
      }

      if (phone.length !== 10 || interest.length === 0) {
        setValid(false);
        return;
      }

      setValid(true);
    }
  };

  useEffect(() => {
    validate();
  }, [phone, interest, password]);

  if (!user) {
    setUser(JSON.parse(sessionStorage.getItem('user')));
  }

  const logout = () => {
    sessionStorage.clear();
    setToken('');
    setUser(null);
    history.push('/login');
  };

  const [updateProfile, { loading, error }] = useMutation(
    UPDATE_PROFILE_MUTATION,
    {
      onError: (error) => alert(error),
      onCompleted: (data) => {
        setEditing(false);
        setUser({ ...user, phone, interest });
      },
    }
  );

  const [
    updatePassword,
    { loading: passwordLoading, error: passwordError },
  ] = useMutation(UPDATE_PASSWORD_MUTATION, {
    onError: (error) => alert(error),
    onCompleted: () => {
      setUpdatingPassword(false);
    },
  });

  if (loading || passwordLoading) {
    return <h2>loading</h2>;
  }

  return (
    <div>
      <h1>Profile</h1>

      {error && <h2>{error.message}</h2>}
      {passwordError && <h2>{passwordError.message}</h2>}

      {editing && (
        <>
          <form>
            <div className='form-row'>
              <label>Email</label>
              {user && <span>{user.email}</span>}
            </div>
            <div className='form-row'>
              <label htmlFor='phone'>Phone</label>
              <input
                placeholder={user.phone}
                value={phone}
                type='tel'
                name='phone'
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div className='form-row'>
              <label htmlFor='interest'>Interest</label>
              <input
                placeholder={user.interest}
                value={interest}
                type='text'
                name='interest'
                onChange={(e) => setInterest(e.target.value)}
              />
            </div>
          </form>

          <div className='button-row-container'>
            <span className='button-row'>
              <button
                className='primary'
                onClick={() =>
                  updateProfile({
                    variables: {
                      phone,
                      interest,
                    },
                  })
                }
                disabled={!valid}
              >
                Save
              </button>
              <button className='secondary' onClick={() => setEditing(false)}>
                Cancel
              </button>
            </span>
          </div>
        </>
      )}

      {updatingPassword && (
        <>
          <form>
            <div className='form-row' id='password-row'>
              <label htmlFor='password'>Password</label>
              <input
                placeholder='******'
                value={password}
                type='password'
                name='password'
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
                onClick={() => setUpdatingPassword(false)}
              >
                Cancel
              </button>
            </span>
          </div>
        </>
      )}

      {!editing && !updatingPassword && (
        <>
          <form>
            <div className='form-row'>
              <label>Email</label>
              {user && <span>{user.email}</span>}
            </div>
            <div className='form-row'>
              <label>Phone</label>
              {user && <span>{user.phone}</span>}
            </div>
            <div className='form-row'>
              <label>Interest</label>
              {user && <span>{user.interest}</span>}
            </div>
          </form>

          <div className='button-row-container'>
            <span className='button-row'>
              <button className='primary' onClick={() => setEditing(true)}>
                Update
              </button>
              <button
                className='secondary'
                onClick={() => setUpdatingPassword(true)}
              >
                Change Password
              </button>
              <button className='secondary' onClick={() => logout()}>
                Logout
              </button>
            </span>
          </div>
        </>
      )}
    </div>
  );
}
