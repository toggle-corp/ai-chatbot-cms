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

import {
    MeQuery,
    MeQueryVariables,
} from '#generated/types/graphql';

import UserContext, {
    UserAuth,
    UserContextProps,
} from '../contexts/user';
import { unwrappedRoutes } from './routes';

const ME_QUERY = gql`
    query Me {
        public {
            me {
                id
                firstName
                lastName
                email
                displayName
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
        <UserContext.Provider value={userContextValue}>
            <RouterProvider router={router} />
        </UserContext.Provider>
    );
}

export default App;
