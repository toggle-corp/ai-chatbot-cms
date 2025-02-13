import { createContext } from 'react';

import { AppEnumsQuery } from '#generated/types/graphql';

export type AppEnums = NonNullable<AppEnumsQuery>['enums'];

export interface AppEnumsContextProps {
    appEnums?: AppEnums,
    appEnumsPending?: boolean,
}

const AppEnumsContext = createContext<AppEnumsContextProps>({
});

export default AppEnumsContext;
