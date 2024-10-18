import { Link } from 'react-router-dom';

import { wrappedRoutes } from '../../App/routes';

/** @knipignore */
// eslint-disable-next-line import/prefer-default-export
export function Component() {
    return (
        <>
            <h1>
                Login
            </h1>
            <Link to={wrappedRoutes.root.absolutePath}>
                Go to home
            </Link>
        </>
    );
}

Component.displayName = 'Login';
