import {
    ApolloClient,
    ApolloClientOptions,
    HttpLink,
    InMemoryCache,
    NormalizedCacheObject,
} from '@apollo/client';

const GRAPHQL_ENDPOINT = import.meta.env.APP_GRAPHQL_ENDPOINT;

const link = new HttpLink({
    uri: GRAPHQL_ENDPOINT,
    credentials: 'include',
});

const apolloOptions: ApolloClientOptions<NormalizedCacheObject> = {
    link,
    cache: new InMemoryCache(),
    defaultOptions: {
        watchQuery: {
            fetchPolicy: 'network-only',
            nextFetchPolicy: 'cache-only',
            errorPolicy: 'all',
        },
        query: {
            fetchPolicy: 'network-only',
            errorPolicy: 'all',
        },
    },
};

const apolloClient = new ApolloClient(apolloOptions);

export default apolloClient;
