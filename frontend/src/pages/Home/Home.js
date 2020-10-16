import React from 'react';
import { useQuery } from 'react-apollo';
import gql from 'graphql-tag';

import { useAppContext } from '../../state/AppContext';
import './Home.css';
import { Redirect } from 'react-router-dom';

const ME_QUERY = gql`
  query MeQuery {
    me {
      email
      phone
      interest
      emailVerified
    }
  }
`;

export default function () {
  const { user, setUser } = useAppContext();

  const { loading, error, data } = useQuery(ME_QUERY, {
    onCompleted: (data) => {
      if (!user) {
        setUser(data.me);
        sessionStorage.setItem('user', JSON.stringify(data.me));
      }
    },
  });

  if (loading) return <h1>loading</h1>;
  if (error) return <h1>{error.message}</h1>;

  const { email, emailVerified } = data.me;

  if (emailVerified === false) {
    return <Redirect to={{ pathname: '/verifyemail', state: { email } }} />;
  }

  return (
    <div>
      <h1>What will you find today?</h1>

      <form id='search-form'>
        <input
          type='text'
          name='search'
          placeholder='find a figure (ex. toaster)...'
        />
        <button className='primary'>Search</button>
      </form>
    </div>
  );
}
