import {
    ApolloClientOptions,
    HttpLink,
    InMemoryCache,
    NormalizedCacheObject,
} from '@apollo/client';

const GRAPHQL_ENDPOINT = process.env.GRAPHQL_ENDPOINT as string;

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

/** @knipignore */
export default apolloOptions;
