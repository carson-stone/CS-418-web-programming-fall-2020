import React from 'react';
import { Switch, Route, useHistory, useLocation } from 'react-router-dom';

import { useAppContext } from './state/AppContext';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Signup from './pages/Signup/Signup';
import RecoverPassword from './pages/RecoverPassword/RecoverPassword';
import VerifyEmail from './pages/VerifyEmail/VerifyEmail';
import Profile from './pages/Profile/Profile';
import Results from './pages/Results/Results';

export default function () {
  const location = useLocation();
  const history = useHistory();
  const { token } = useAppContext();

  if (
    token === '' &&
    location.pathname !== '/login' &&
    location.pathname !== '/recoverpassword' &&
    location.pathname !== '/signup' &&
    location.pathname !== '/verifyemail'
  ) {
    return <Login />;
  }

  if (
    token &&
    (location.pathname === '/login' || location.pathname === '/signup')
  ) {
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
      <Route path='/signup' exact>
        <Signup />
      </Route>
      <Route path='/recoverpassword' exact>
        <RecoverPassword />
      </Route>
      <Route
        path='/verifyemail'
        exact
        render={(props) => <VerifyEmail {...props} />}
      />
      <Route path='/profile' exact>
        <Profile />
      </Route>
      <Route path='/results' exact render={(props) => <Results {...props} />} />
    </Switch>
  );
}
