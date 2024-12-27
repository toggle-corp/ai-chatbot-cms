import { createContext } from 'react';

import { MeQuery } from '#generated/types/graphql';

export type UserAuth = NonNullable<NonNullable<MeQuery>['public']>['me'];

export interface UserContextProps {
    userAuth: UserAuth | undefined,
    setUserAuth: (userDetails: UserAuth) => void,
    removeUserAuth: () => void;
}

const UserContext = createContext<UserContextProps>({
    setUserAuth: () => {
        // eslint-disable-next-line no-console
        console.warn('UserContext::setUser called without provider');
    },
    removeUserAuth: () => {
        // eslint-disable-next-line no-console
        console.warn('UserContext::removeUser called without provider');
    },
    userAuth: undefined,
});

export default UserContext;
