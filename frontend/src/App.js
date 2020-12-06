import React, { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';

import { AppContext } from './state/AppContext';
import Routes from './Routes';
import NavBar from './components/NavBar/NavBar';
import './App.css';

const App = function () {
	let sessionToken = '';

	if (sessionStorage.getItem('token')) {
		sessionToken = sessionStorage.getItem('token');
	}

	const [token, setToken] = useState(sessionToken);
	const [user, setUser] = useState(null);

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
			<AppContext.Provider value={{ token, setToken, user, setUser }}>
				<Router>
					<div className='App'>
						<NavBar />
						<Routes />
					</div>
				</Router>
			</AppContext.Provider>
		</ApolloProvider>
	);
};

export default App;
