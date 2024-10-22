import './index.css';

import React from 'react';
import ReactDOM from 'react-dom/client';
import {
    ApolloClient,
    ApolloProvider,
} from '@apollo/client';

import apolloOptions from '#configs/apollo';

import App from './App/index.tsx';

const webappRootId = 'webapp-root';

const webappRootElement = document.getElementById(webappRootId);

const apolloClient = new ApolloClient(apolloOptions);

if (!webappRootElement) {
    // eslint-disable-next-line no-console
    console.error(`Could not find html element with id '${webappRootId}'`);
} else {
    ReactDOM.createRoot(webappRootElement).render(
        <React.StrictMode>
            <ApolloProvider client={apolloClient}>
                <App />
            </ApolloProvider>
        </React.StrictMode>,
    );
}
