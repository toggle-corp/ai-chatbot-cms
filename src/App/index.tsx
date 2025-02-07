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
import { unique } from '@togglecorp/fujs';

import AlertContext, {
    AlertContextProps,
    AlertParams,
} from '#contexts/alert';
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
                displayName
            }
        }
    }
`;

const router = createBrowserRouter(unwrappedRoutes);

function App() {
    const [userAuth, setUserAuth] = useState<UserAuth>();

    // ALERTS

    const [alerts, setAlerts] = useState<AlertParams[]>([]);

    const addAlert = useCallback((alert: AlertParams) => {
        setAlerts((prevAlerts) => unique(
            [...prevAlerts, alert],
            (a) => a.name,
        ) ?? prevAlerts);
    }, [setAlerts]);

    const removeAlert = useCallback((name: AlertParams['name']) => {
        setAlerts((prevAlerts) => {
            const i = prevAlerts.findIndex((a) => a.name === name);
            if (i === -1) {
                return prevAlerts;
            }

            const newAlerts = [...prevAlerts];
            newAlerts.splice(i, 1);

            return newAlerts;
        });
    }, [setAlerts]);

    const updateAlert = useCallback((name: AlertParams['name'], paramsWithoutName: Omit<AlertParams, 'name'>) => {
        setAlerts((prevAlerts) => {
            const i = prevAlerts.findIndex((a) => a.name === name);
            if (i === -1) {
                return prevAlerts;
            }

            const updatedAlert = {
                ...prevAlerts[i],
                ...paramsWithoutName,
            };

            const newAlerts = [...prevAlerts];
            newAlerts.splice(i, 1, updatedAlert);

            return newAlerts;
        });
    }, [setAlerts]);

    const alertContextValue: AlertContextProps = useMemo(() => ({
        alerts,
        addAlert,
        updateAlert,
        removeAlert,
    }), [alerts, addAlert, updateAlert, removeAlert]);

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
                <AlertContext.Provider value={alertContextValue}>
                    <RouterProvider router={router} />
                </AlertContext.Provider>
            </UserContext.Provider>
        </RouteContext.Provider>
    );
}

export default App;
