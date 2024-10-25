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
            id
            me {
                displayName
                email
                firstName
                id
                lastName
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
        if (loading) {
            return;
        }
        setUserAuth(meResult?.public.me ?? undefined);
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

    return (
        <UserContext.Provider value={userContextValue}>
            <RouterProvider router={router} />
        </UserContext.Provider>
    );
}

export default App;
