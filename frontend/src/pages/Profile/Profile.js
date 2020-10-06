import React from 'react';
import { useHistory } from 'react-router-dom';

import { useAppContext } from '../../state/AppContext';

export default function () {
  const history = useHistory();

  const { user, setUser, setToken } = useAppContext();

  if (!user) {
    setUser(JSON.parse(sessionStorage.getItem('user')));
  }

  const logout = () => {
    sessionStorage.clear();
    setToken('');
    setUser(null);
    history.push('/login');
  };

  return (
    <div>
      <h1>Profile</h1>

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
          <button className='primary'>Update</button>
          <button className='secondary'>Change Password</button>
          <button className='secondary' onClick={() => logout()}>
            Logout
          </button>
        </span>
      </div>
    </div>
  );
}
