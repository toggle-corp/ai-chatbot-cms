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

import Container from '#components/Container';
import useAlert from '#hooks/useAlert';

import styles from './styles.module.css';

const ACCOUNT_ACTIVATION_MUTATION = gql`
  mutation AccountActivation($data: UserActivationInput!) {
    public {
      accountActivation(data: $data) {
        ok
        errors
      }
    }
  }
`;

/** @knipignore */
// eslint-disable-next-line import/prefer-default-export
export function Component() {
    const alert = useAlert();
    const { userId, token } = useParams<{ userId?: string, token?: string }>();
    const [isErrored, setIsError] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [
        activateTrigger,,
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
            alert.show(
                'This account has already been activated.', // FIXME:Add alert.show,
            );
        },
    });

    useEffect(() => {
        if (userId && token) {
            activateTrigger({
                variables: {
                    data: {
                        uuid: userId,
                        token,
                    },
                },
            });
        }
    }, [token, activateTrigger, userId]);

    if (isSubmitted) {
        return (
            <Container className={styles.userActivation}>
                <Message
                    message="Your account has been successfully activated!"
                />
                <div className={styles.activation}>
                    <Link
                        className={styles.register}
                        to={`/register/${userId}/${token}`}
                    >
                        Go to Register
                    </Link>
                </div>
            </Container>
        );
    }
    if (isErrored) {
        return (
            <Container
                className={styles.userActivation}
            >
                <Message
                    message="This account has already been activated."
                />

            </Container>

        );
    }
    return null;
}

Component.displayName = 'Activation';
