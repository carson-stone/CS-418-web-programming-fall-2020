import React, { useState } from 'react';
import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import gql from 'graphql-tag';

import { AppContext } from './state/AppContext';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import './App.css';

const App = function () {
  const [token, setToken] = useState('initial token');

  const httpLink = createHttpLink({
    uri: 'http://localhost:8000/graphql/',
    headers: {
      Authorization: `JWT ${token}`,
    },
  });

  let client = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache(),
  });

  return (
    <ApolloProvider client={client}>
      <AppContext.Provider value={{ token, setToken }}>
        <div className='App'>
          <Login />
          <Home />
        </div>
      </AppContext.Provider>
    </ApolloProvider>
  );
};

export default App;
