import {
    useMemo,
    useState,
} from 'react';
import { Outlet } from 'react-router-dom';
import {
    gql,
    useQuery,
} from '@apollo/client';

import AppEnumsContext, {
    AppEnums,
    AppEnumsContextProps,
} from '#contexts/appEnums';
import {
    AppEnumsQuery,
    AppEnumsQueryVariables,
} from '#generated/types/graphql';

import styles from './styles.module.css';

const APP_ENUMS_QUERY = gql`
    query AppEnums {
        enums {
            ContentDocumentStatus {
                key
                label
            }
            ContentDocumentType {
                key
                label
            }
            UserDepartment {
                key
                label
            }
        }
    }
`;

// eslint-disable-next-line import/prefer-default-export
export function Component() {
    const [appEnums, setAppEnums] = useState<AppEnums>();
    const {
        loading: appEnumsLoading,
    } = useQuery<AppEnumsQuery, AppEnumsQueryVariables>(
        APP_ENUMS_QUERY,
        {
            onCompleted: (data) => {
                setAppEnums(data.enums);
            },
        },
    );

    const appEnumsContextValue = useMemo<AppEnumsContextProps>(
        () => ({
            appEnums,
            appEnumsLoading,
        }),
        [appEnums, appEnumsLoading],
    );

    return (
        <AppEnumsContext.Provider value={appEnumsContextValue}>
            <div className={styles.root}>
                <div className={styles.pageContent}>
                    <Outlet />
                </div>
            </div>
        </AppEnumsContext.Provider>
    );
}

Component.displayName = 'Root';
