import {
    generatePath,
    useNavigate,
    useParams,
} from 'react-router-dom';

import routes from '../routes';

interface ActivationParams {
    userId: string | undefined;
    token: string | undefined;
    [key: string]: string | undefined;
}
/** @knipignore */
// eslint-disable-next-line import/prefer-default-export
export function Component() {
    const { userId, token } = useParams<ActivationParams>();
    const navigate = useNavigate();

    if (userId && token) {
        const activationLink = generatePath(
            routes.userActivation.absolutePath,
            { userId, token },
        );
        navigate(activationLink);
    }
    return null;
}

Component.displayName = 'ActivationRedirect';
