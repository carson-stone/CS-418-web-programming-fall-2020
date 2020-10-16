import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useMutation } from 'react-apollo';
import gql from 'graphql-tag';

const VERIFY_ACCOUNT_QUERY = gql`
  mutation VerifyAccountQuery($email: String!, $code: String!) {
    verifyEmail(email: $email, code: $code) {
      success
    }
  }
`;

export default function (props) {
  const { email } = props.location.state;
  const [valid, setValid] = useState('');
  const [code, setCode] = useState('');
  const [message, setMessage] = useState(
    'Verify your account by entering the code that was sent to your email address'
  );

  const history = useHistory();

  const validate = () => {
    if (code.length === 0) {
      setValid(false);
      return;
    }

    setValid(true);
  };

  useEffect(() => {
    validate();
  }, [code]);

  const [verify, { loading, error }] = useMutation(VERIFY_ACCOUNT_QUERY, {
    onCompleted: (data) => {
      if (data.verifyEmail.success) {
        history.push('/');
        return <></>;
      }

      setMessage('The code you entered was incorrect');
    },
  });

  if (loading) {
    return <h2>loading</h2>;
  }

  return (
    <div>
      <h1>{message}</h1>

      {error && <h2>{error.message}</h2>}

      <form>
        <label htmlFor='code'>
          Code
          <input
            name='code'
            type='text'
            onChange={(e) => setCode(e.target.value)}
          />
        </label>
      </form>

      <div className='button-row-container'>
        <span className='button-row'>
          <button
            className='primary'
            onClick={(e) => {
              e.preventDefault();
              verify({
                variables: { email, code },
              });
            }}
            disabled={!valid}
          >
            Verify
          </button>
        </span>
      </div>
    </div>
  );
}
