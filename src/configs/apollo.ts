import {
    ApolloClientOptions,
    ApolloLink,
    HttpLink,
    InMemoryCache,
    NormalizedCacheObject,
} from '@apollo/client';
import createUploadLink from 'apollo-upload-client/createUploadLink.mjs';

const GRAPHQL_ENDPOINT = import.meta.env.APP_GRAPHQL_ENDPOINT;

const httpLink = new HttpLink({
    uri: GRAPHQL_ENDPOINT,
    credentials: 'include',
});

const uploadLink = createUploadLink({
    uri: GRAPHQL_ENDPOINT,
    credentials: 'include',
});

const link: ApolloLink = ApolloLink.from([
    ApolloLink.split(
        (operation) => operation.getContext().hasUpload,
        uploadLink,
        httpLink,
    ),
]);

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

export default apolloOptions;
