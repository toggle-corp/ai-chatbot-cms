import {
    generatePath,
    useNavigate,
    useParams,
} from 'react-router-dom';

import routes from '../routes';

interface RegisterParams {
    userId: string;
    registerToken: string;
    [key: string]: string | undefined;
}

/** @knipignore */
// eslint-disable-next-line import/prefer-default-export
export function Component() {
    const { userId, registerToken } = useParams<RegisterParams>();
    const navigate = useNavigate();

    if (userId && registerToken) {
        const registerLink = generatePath(
            routes.register.absolutePath,
            { userId, registerToken },
        );
        navigate(registerLink);
    }
    return null;
}

Component.displayName = 'RegisterRedirect';
