import React from 'react';
import { Switch, Route, useHistory, useLocation } from 'react-router-dom';

import { useAppContext } from './state/AppContext';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Profile from './pages/Profile/Profile';

export default function () {
  const location = useLocation();
  const history = useHistory();
  const { token } = useAppContext();

  if (token === '' && location.pathname !== '/login') {
    history.push('/login');
    return <Login />;
  }

  if (token && location.pathname === '/login') {
    history.push('/');
  }

  return (
    <Switch>
      <Route path='/' exact>
        <Home />
      </Route>
      <Route path='/login' exact>
        <Login />
      </Route>
      <Route path='/profile' exact>
        <Profile />
      </Route>
    </Switch>
  );
}
