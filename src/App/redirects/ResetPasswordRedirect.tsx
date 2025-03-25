import {
    generatePath,
    useNavigate,
    useParams,
} from 'react-router-dom';

import routes from '../routes';

interface ResetPasswordParams {
    userId: string | undefined;
    resetToken: string | undefined;
    [key: string]: string | undefined;
}
/** @knipignore */
// eslint-disable-next-line import/prefer-default-export
export function Component() {
    const { userId, token } = useParams<ResetPasswordParams>();
    const navigate = useNavigate();

    if (userId && token) {
        const resetPasswordLink = generatePath(
            routes.forgotPasswordConfirm.absolutePath,
            { userId, token },
        );
        navigate(resetPasswordLink);
    }
    return null;
}

Component.displayName = 'ResetPasswordRedirect';
