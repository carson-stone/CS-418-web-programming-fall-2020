import React, { useState } from 'react';
import { useMutation, useQuery } from 'react-apollo';
import gql from 'graphql-tag';

const GET_SAVED = gql`
  query GetSavedFigures {
    me {
      profile {
        savedFigures {
          patentId
        }
      }
    }
  }
`;

const TOGGLE_SAVE_FIGURE_MUTATION = gql`
  mutation ToggleSaveFigure(
    $id: String!
    $object: String!
    $description: String!
    $aspect: String!
    $imagePath: String!
  ) {
    toggleSaveFigure(
      id: $id
      object: $object
      description: $description
      aspect: $aspect
      imagePath: $imagePath
    ) {
      ok
    }
  }
`;

export default function (props) {
  const { id, object, description, aspect, image } = props.location.state;

  const [button, setButton] = useState();

  const { loading: figuresLoading, error: figureError } = useQuery(GET_SAVED, {
    onCompleted: (data) =>
      setButton(
        data.me.profile.savedFigures.some(({ patentId }) => id === patentId)
          ? 'Unsave'
          : 'Save'
      ),
  });

  const [toggleSaveFigure, { loading, error }] = useMutation(
    TOGGLE_SAVE_FIGURE_MUTATION,
    {
      refetchQueries: ['GetSavedFigures'],
      onCompleted: (data) =>
        data.toggleSaveFigure.ok
          ? setButton(button === 'Save' ? 'Unsave' : 'Save')
          : alert('Error saving figure'),
    }
  );

  if (loading || figuresLoading) {
    return <h2>loading</h2>;
  }

  return (
    <div>
      {error && <h2>{error.message}</h2>}
      {figureError && <h2>{figureError.message}</h2>}

      <span className='figure-and-btn'>
        <h1>{object}</h1>
        {button === 'Save' ? (
          <button
            className='primary'
            onClick={() =>
              toggleSaveFigure({
                variables: {
                  id,
                  object,
                  description,
                  aspect,
                  imagePath: image,
                },
              })
            }
          >
            {button}
          </button>
        ) : (
          <button
            className='primary'
            style={{ backgroundColor: '#595959' }}
            onClick={() =>
              toggleSaveFigure({
                variables: {
                  id,
                  object,
                  description,
                  aspect,
                  imagePath: image,
                },
              })
            }
          >
            {button}
          </button>
        )}
      </span>

      <img className='result-img' src={`${image}`} />

      <form>
        <div className='form-row figure'>
          <label>Description</label>
          <span>{description}</span>
        </div>
        <div className='form-row figure'>
          <label>Patent ID</label>
          <span>{id}</span>
        </div>
        <div className='form-row figure'>
          <label>Aspect</label>
          <span>{aspect}</span>
        </div>
      </form>
    </div>
  );
}
