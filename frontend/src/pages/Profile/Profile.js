import React from 'react';
import { useHistory } from 'react-router-dom';

import { useAppContext } from '../../state/AppContext';

export default function () {
  const history = useHistory();

  const { user, setUser, setToken } = useAppContext();

  // if (!user) {
  //   setUser(JSON.parse(sessionStorage.getItem('user')));
  // }

  const logout = () => {
    sessionStorage.clear();
    setToken('');
    history.push('/login');
  };

  return (
    <div>
      <h1>Profile</h1>

      <p>{user && user.email}</p>
      <button className='primary'>Update</button>
      <button className='secondary'>Change Password</button>
      <button className='secondary' onClick={() => logout()}>
        Logout
      </button>
    </div>
  );
}