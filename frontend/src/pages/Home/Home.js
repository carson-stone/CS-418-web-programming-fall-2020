import React, { useState, useRef } from 'react';
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

export const INDEX_MUTATION = gql`
  mutation IndexMutation(
    $description: String!
    $patentId: String!
    $object: String!
    $aspect: String!
    $image: String!
  ) {
    index(
      description: $description
      patentId: $patentId
      object: $object
      aspect: $aspect
      image: $image
    ) {
      ok
    }
  }
`;

export default function () {
  const { user, setUser } = useAppContext();

  const [fileString, setFileString] = useState('');
  const [results, setResults] = useState(null);

  const { loading, error, data } = useQuery(ME_QUERY, {
    onCompleted: (data) => {
      if (!user) {
        setUser(data.me);
        sessionStorage.setItem('user', JSON.stringify(data.me));
      }
    },
  });

  const [search, { loading: searchLoading, error: searchError }] = useMutation(
    SEARCH_MUTATION,
    {
      onCompleted: (data) => setResults(data.search.figures),
    }
  );

  const [index, { loading: indexLoading, error: indexError }] = useMutation(
    INDEX_MUTATION,
    {
      onCompleted: (data) =>
        data.index.ok && alert('Your figure has been added!'),
      onError: (error) => alert(error),
    }
  );

  const [values, setValues] = useFormFields({
    description: '',
    patentId: '',
    object: '',
    aspect: '',
    addDescription: '',
    addPatentId: '',
    addObject: '',
    addAspect: '',
  });

  const file = useRef(null);

  if (loading || searchLoading || indexLoading) return <h1>loading</h1>;
  if (error) return <h1>{error.message}</h1>;
  if (searchError) return <h1>{searchError.message}</h1>;
  if (indexError) return <h1>{indexError.message}</h1>;

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
          search({
            variables: {
              description: values.description,
              object: values.object,
              aspect: values.aspect,
              patentId: values.patentId,
            },
          });
        }}
      >
        <span id='search-box-and-btn'>
          <input
            type='text'
            id='description'
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
              id='object'
              name='object'
              placeholder='ex. toaster'
              value={values.object}
              onChange={(e) => setValues(e)}
            />
          </label>
          <label htmlFor='patentId'>
            Patent ID
            <input
              type='text'
              id='patentId'
              name='patentId'
              placeholder='xxxxxxxxxx-xxxxxxxx'
              value={values.patentId}
              onChange={(e) => setValues(e)}
            />
          </label>
          <label htmlFor='aspect'>
            Viewing Aspect
            <input
              type='text'
              id='aspect'
              name='aspect'
              placeholder='ex. top'
              value={values.aspect}
              onChange={(e) => setValues(e)}
            />
          </label>
        </div>
      </form>

      <form>
        <div id='advanced-search'>
          <h3>Add a figure</h3>

          <label htmlFor='addObject'>
            Object
            <input
              type='text'
              id='addObject'
              name='addObject'
              placeholder='ex. toaster'
              value={values.addObject}
              onChange={(e) => setValues(e)}
            />
          </label>
          <label htmlFor='addPatentId'>
            Patent ID - figure is indexed as "(patent ID)-D0000.png"
            <input
              type='text'
              id='addPatentId'
              name='addPatentId'
              placeholder='xxxxxxxxxx-xxxxxxxx'
              value={values.addPatentId}
              onChange={(e) => setValues(e)}
            />
          </label>
          <label htmlFor='addAspect'>
            Viewing Aspect
            <input
              type='text'
              id='addAspect'
              name='addAspect'
              placeholder='ex. top'
              value={values.addAspect}
              onChange={(e) => setValues(e)}
            />
          </label>
          <label htmlFor='addDescription'>
            Description
            <textarea
              id='addDescription'
              name='addDescription'
              value={values.addDescription}
              onChange={(e) => setValues(e)}
              rows='8'
            ></textarea>
          </label>
          <label htmlFor='addImage'>
            Image
            <input
              type='file'
              id='addImage'
              name='addImage'
              onChange={(e) => {
                file.current = e.target.files[0];

                const reader = new FileReader();
                reader.onloadend = () => setFileString(reader.result);
                reader.readAsDataURL(file.current);
              }}
            />
          </label>
        </div>
        <button
          className='primary'
          id='add-figure-btn'
          onClick={(e) => {
            e.preventDefault();

            index({
              variables: {
                description: values.addDescription,
                object: values.addObject,
                patentId: values.addPatentId,
                aspect: values.addAspect,
                image: fileString,
              },
            });
          }}
        >
          Add
        </button>
      </form>
    </div>
  );
}
