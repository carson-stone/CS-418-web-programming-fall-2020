import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useMutation } from 'react-apollo';
import gql from 'graphql-tag';

import { useAppContext } from '../../state/AppContext';

const AUTHENTICATE_QUERY = gql`
  mutation AuthenticateQuery($email: String!, $password: String!) {
    tokenAuth(username: $email, password: $password) {
      token
    }
  }
`;

export default function () {
  const history = useHistory();

  const { setToken } = useAppContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [authenticate, { loading, error }] = useMutation(AUTHENTICATE_QUERY, {
    onError: (error) => alert(error),
    onCompleted: (data) => {
      setToken(data.tokenAuth.token);
      sessionStorage.setItem('token', data.tokenAuth.token);
      history.push('/');
    },
  });

  if (loading) {
    return <h2>loading</h2>;
  }

  return (
    <div>
      <h1>Login</h1>

      {error && <h2>{error.message}</h2>}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          authenticate({
            variables: { email, password },
          });
        }}
      >
        <label htmlFor='email'>
          email
          <input
            name='email'
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>

        <label htmlFor='password'>
          password
          <input
            name='password'
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>

        <button>submit</button>
      </form>
    </div>
  );
}
