import React from 'react';
import { useQuery } from 'react-apollo';
import gql from 'graphql-tag';

import { useAppContext } from '../../state/AppContext';
import './Home.css';

const ME_QUERY = gql`
  query MeQuery {
    me {
      id
      email
      phone
      interest
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

  const { email } = data.me;

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
