import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { useQuery, useMutation } from 'react-apollo';
import gql from 'graphql-tag';

import { useAppContext } from '../../state/AppContext';
import useFormFields from '../../hooks/useFormFields';
import './Home.css';

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

export const SEARCH_MUTATION = gql`
  mutation SearchMutation(
    $description: String!
    $patentId: String
    $object: String
    $aspect: String
  ) {
    search(
      description: $description
      patentId: $patentId
      object: $object
      aspect: $aspect
    ) {
      figures {
        patentId
        object
      }
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

  const [results, setResults] = useState(null);

  const [search, { loading: searchLoading, error: searchError }] = useMutation(
    SEARCH_MUTATION,
    {
      onCompleted: (data) => setResults(data.search.figures),
    }
  );

  const [values, setValues] = useFormFields({
    description: '',
    patentId: '',
    object: '',
    aspect: '',
  });

  if (loading || searchLoading) return <h1>loading</h1>;
  if (error) return <h1>{error.message}</h1>;
  if (searchError) return <h1>{searchError.message}</h1>;

  const { email, emailVerified } = data.me;

  if (emailVerified === false) {
    return (
      <Redirect
        to={{
          pathname: '/verifyemail',
          state: { email },
        }}
      />
    );
  }

  if (results) {
    return (
      <Redirect
        to={{
          pathname: '/results',
          state: { results, query: values.description },
        }}
      />
    );
  }

  return (
    <div>
      <h1>What will you find today?</h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          search({ variables: { ...values } });
        }}
      >
        <span id='search-box-and-btn'>
          <input
            type='text'
            name='description'
            placeholder='ex. toaster designs'
            value={values.search}
            onChange={(e) => setValues(e)}
          />
          <button className='primary'>Search</button>
        </span>

        <div id='advanced-search'>
          <h3>Advanced search</h3>

          <label htmlFor='object'>
            Object
            <input
              type='text'
              name='object'
              placeholder='ex. toaster'
              value={values.object}
              onChange={(e) => setValues(e)}
            />
          </label>
          <label htmlFor='patent-id'>
            Patent ID
            <input
              type='text'
              name='patentId'
              placeholder='xxxxxxxxxx-xxxxxxxx'
              value={values['patent-id']}
              onChange={(e) => setValues(e)}
            />
          </label>
          <label htmlFor='aspect'>
            Viewing Aspect
            <input
              type='aspect'
              name='aspect'
              placeholder='ex. top'
              value={values.aspect}
              onChange={(e) => setValues(e)}
            />
          </label>
        </div>
      </form>
    </div>
  );
}
