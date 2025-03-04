import {
    useEffect,
    useState,
} from 'react';
import {
    Link,
    useParams,
} from 'react-router-dom';
import {
    gql,
    useMutation,
} from '@apollo/client';
import { Message } from '@togglecorp/toggle-ui';

import Page from '#components/Page';

import styles from './styles.module.css';

const ACCOUNT_ACTIVATION_MUTATION = gql`
    mutation AccountActivation($data: UserActivationInput!) {
        public {
            accountActivation(data: $data) {
                errors
                ok
            }
        }
    }
`;

// eslint-disable-next-line import/prefer-default-export
export function Component() {
    const { userId, token } = useParams<{ userId?: string, token?: string }>();
    const [isErrored, setIsError] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [
        activate,
    ] = useMutation(ACCOUNT_ACTIVATION_MUTATION, {
        onCompleted: (response) => {
            const activateRes = response?.public?.accountActivation;
            if (!response) {
                return;
            }
            if (activateRes.ok) {
                setIsSubmitted(true);
            } else {
                setIsError(true);
            }
        },
        onError: () => {
            // eslint-disable-next-line no-alert
            window.alert(
                'This account has already been activated.',
            );
        },
    });

    useEffect(() => {
        if (userId && token) {
            activate({
                variables: {
                    data: {
                        uuid: userId,
                        token,
                    },
                },
            });
        }
    }, [token, activate, userId]);

    if (isSubmitted) {
        return (
            <Page>
                <Message
                    message="Your account has been successfully activated!"
                />
                <div className={styles.activation}>
                    <Link
                        to="/" // FIXME:Add register link here
                    >
                        Go to Register
                    </Link>
                </div>

            </Page>
        );
    }
    if (isErrored) {
        return (
            <Page>
                <Message
                    message="'This account has already been activated.'"
                />
            </Page>
        );
    }
    return null;
}

Component.displayName = 'Activation';
