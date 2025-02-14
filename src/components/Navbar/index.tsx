import {
    useCallback,
    useContext,
} from 'react';
import { IoPersonCircleSharp } from 'react-icons/io5';
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

import DropdownMenu from '#components/DropdownMenu';
import DropdownMenuItem from '#components/DropdownMenuItem';
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
  mutation Logout {
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
    const handleLogoutClick = useCallback(() => {
        logout();
    }, [logout]);

    return (
        <nav className={_cs(styles.navbar, className)}>
            <Heading level={5}>
                ToggTalkie
            </Heading>
            <DropdownMenu
                className={styles.dropdown}
                label="User" // FIXME :Change the User label after server side is ready
                icons={<IoPersonCircleSharp className={styles.icons} />}
            >
                {isNotDefined(userAuth) && (
                    <Link
                        type="link"
                        to="login"
                    >
                        Login
                    </Link>
                )}
                <DropdownMenuItem
                    className={styles.editProfile}
                    type="link"
                    to="edit-url"
                >
                    Edit Profile
                </DropdownMenuItem>
                {isDefined(userAuth) && (
                    <DropdownMenuItem
                        className={styles.logoutButton}
                        type="button"
                        name="logout"
                        onClick={handleLogoutClick}
                        disabled={loading}
                    >
                        Logout
                    </DropdownMenuItem>
                )}
            </DropdownMenu>
        </nav>
    );
}

export default Navbar;
