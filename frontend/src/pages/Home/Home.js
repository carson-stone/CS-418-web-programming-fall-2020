import React from 'react';
import { useQuery } from 'react-apollo';
import gql from 'graphql-tag';

import './Home.css';

const ME_QUERY = gql`
  query MeQuery {
    me {
      email
      phone
      interest
    }
  }
`;

export default function () {
  const { loading, error, data } = useQuery(ME_QUERY);

  if (loading) return <h1>loading</h1>;
  if (error) return <h1>{error.message}</h1>;

  const { email, phone, interest } = data.me;

  return <h1>{email}</h1>;
}
