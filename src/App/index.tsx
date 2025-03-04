import '@togglecorp/toggle-ui/build/index.css';

import {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from 'react';
import {
    createBrowserRouter,
    RouterProvider,
} from 'react-router-dom';
import {
    gql,
    useQuery,
} from '@apollo/client';

import RouteContext from '#contexts/route';
import UserContext, {
    UserAuth,
    UserContextProps,
} from '#contexts/user';
import {
    MeQuery,
    MeQueryVariables,
} from '#generated/types/graphql';

import wrappedRoutes, { unwrappedRoutes } from './routes';

const ME_QUERY = gql`
    query Me {
        public {
            me {
                id
                firstName
                lastName
                email
            }
        }
    }
`;

const router = createBrowserRouter(unwrappedRoutes);

function App() {
    const [userAuth, setUserAuth] = useState<UserAuth>();

    const {
        loading,
        data: meResult,
    } = useQuery<MeQuery, MeQueryVariables>(
        ME_QUERY,
    );

    useEffect(() => {
        if (!loading) {
            setUserAuth(meResult?.public.me ?? undefined);
        }
    }, [meResult, loading]);

    const removeUserAuth = useCallback(
        () => {
            setUserAuth(undefined);
        },
        [],
    );

    const userContextValue = useMemo<UserContextProps>(
        () => ({
            userAuth,
            setUserAuth,
            removeUserAuth,
        }),
        [userAuth, removeUserAuth],
    );

    if (loading) {
        // NOTE: Handle checking user session for loading state
        return null;
    }

    return (
        <RouteContext.Provider value={wrappedRoutes}>
            <UserContext.Provider value={userContextValue}>
                <RouterProvider router={router} />
            </UserContext.Provider>
        </RouteContext.Provider>
    );
}

export default App;
