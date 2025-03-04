import { useContext } from 'react';
import { Link } from 'react-router-dom';
import {
    gql,
    useMutation,
} from '@apollo/client';
import {
    _cs,
    isDefined,
    isNotDefined,
} from '@togglecorp/fujs';
import { Button } from '@togglecorp/toggle-ui';

import Heading from '#components/Heading';
import UserContext from '#contexts/user';
import {
    LogoutMutation,
    LogoutMutationVariables,
} from '#generated/types/graphql';

import styles from './styles.module.css';

interface Props {
    className?: string;
}

const LOGOUT_MUTATION = gql`
    mutation logout {
        private {
            logout {
                ok
                errors
            }
        }
    }
`;

function Navbar(props: Props) {
    const { className } = props;

    const { userAuth, removeUserAuth } = useContext(UserContext);

    const [
        logout,
        { loading },
    ] = useMutation<LogoutMutation, LogoutMutationVariables>(
        LOGOUT_MUTATION,
        {
            onCompleted: (response) => {
                const { logout: logoutRes } = response.private;
                if (!logoutRes) {
                    return;
                }

                const {
                    ok,
                    // FIXME Use errors message in alert
                    // errors,
                } = logoutRes;

                if (ok) {
                    removeUserAuth();
                }
            },
        },
    );

    return (
        <nav className={_cs(styles.navbar, className)}>
            <Heading level={5}>
                ToggTalkie
            </Heading>
            <div>
                {isNotDefined(userAuth) && (
                    <Link
                        to="login"
                    >
                        Login
                    </Link>
                )}
                {isDefined(userAuth) && (
                    <Button
                        name={undefined}
                        onClick={logout}
                        disabled={loading}
                    >
                        Logout
                    </Button>
                )}
            </div>
        </nav>
    );
}

export default Navbar;
