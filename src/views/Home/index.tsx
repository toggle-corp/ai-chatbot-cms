import { Link } from 'react-router-dom';

import { wrappedRoutes } from '../../App/routes';

/** @knipignore */
// eslint-disable-next-line import/prefer-default-export
export function Component() {
    return (
        <>
            <h1>
                AI CHATBOT CMS
            </h1>
            <Link to={wrappedRoutes.login.absolutePath}>
                Login
            </Link>
        </>
    );
}

Component.displayName = 'Home';
