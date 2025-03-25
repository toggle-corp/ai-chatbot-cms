import { useCallback } from 'react';
import { IoEllipsisVertical } from 'react-icons/io5';
import { useParams } from 'react-router-dom';
import {
    gql,
    useMutation,
} from '@apollo/client';

import DropdownMenu from '#components/DropdownMenu';
import DropdownMenuItem from '#components/DropdownMenuItem';
import {
    AccountActivationMutation,
    AccountActivationMutationVariables,
    AccountDeactivationMutation,
    AccountDeactivationMutationVariables,
} from '#generated/types/graphql';
import useAlert from '#hooks/useAlert';

import styles from './styles.module.css';

interface UserActionsProps {
  userName: string;
  isActive: boolean;
}

const ACCOUNT_DEACTIVATION_MUTATION = gql`
  mutation AccountDeactivation($data: UserDeactivationInput!) {
    public {
      accountDeactivation(data: $data) {
        ok
        errors
      }
    }
  }
`;

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

function UserActions(props: UserActionsProps) {
    const { userName, isActive } = props;
    const { userId, token } = useParams<{ userId?: string, token:string }>();
    const alert = useAlert();

    const [
        triggerDeactivation,
    ] = useMutation<
        AccountDeactivationMutation,
        AccountDeactivationMutationVariables
    >(
        ACCOUNT_DEACTIVATION_MUTATION,
        {
            onCompleted: (response) => {
                const { errors, ok } = response.public.accountDeactivation;
                if (errors) {
                    alert.show(
                        'Account deactivation failed',
                        { variant: 'danger' },
                    );
                } else if (ok) {
                    alert.show(
                        'Account deactivated successfully',
                        { variant: 'success' },
                    );
                }
            },
            onError: () => {
                alert.show(
                    'Account deactivation failed',
                    { variant: 'danger' },
                );
            },
        },
    );

    const [
        triggerActivation,
    ] = useMutation<
        AccountActivationMutation,
        AccountActivationMutationVariables
    >(
        ACCOUNT_ACTIVATION_MUTATION,
        {
            onCompleted: (response) => {
                const { errors, ok } = response.public.accountActivation;
                if (errors) {
                    alert.show(
                        'Account activation failed',
                        { variant: 'danger' },
                    );
                } else if (ok) {
                    alert.show(
                        'Account activated successfully',
                        { variant: 'success' },
                    );
                }
            },
            onError: () => {
                alert.show(
                    'Account activation failed',
                    { variant: 'danger' },
                );
            },
        },
    );

    const handleDeactivation = useCallback(() => {
        if (userId) {
            triggerDeactivation({
                variables: {
                    data: {
                        userId,
                    },
                },
            });
        } else {
            alert.show(
                'User ID is required to deactivate account',
                { variant: 'danger' },
            );
        }
    }, [triggerDeactivation, userId, alert]);

    const handleActivation = useCallback(() => {
        if (userId && token) {
            triggerActivation({
                variables: {
                    data: {
                        uuid: userId,
                        token,
                    },
                },
            });
        } else {
            alert.show(
                'User ID is required to activate account',
                { variant: 'danger' },
            );
        }
    }, [userId, token, triggerActivation, alert]);

    return (
        <div className={styles.userActions}>
            <DropdownMenu
                withoutDropdownIcon
                icons={(
                    <IoEllipsisVertical />
                )}
            >
                {isActive ? (
                    <DropdownMenuItem
                        type="confirm-button"
                        name="deactivation"
                        confirmationHeader="Deactivate User"
                        confirmationMessage={
                            `Are you sure you want to deactivate ${userName}'s account?`
                        }
                        confirmLabel="Yes"
                        cancelLabel="No"
                        onCancel={() => {}}
                        onConfirm={handleDeactivation}
                        transparent
                    >
                        Deactivate account
                    </DropdownMenuItem>
                ) : (
                    <DropdownMenuItem
                        type="confirm-button"
                        name="activation"
                        confirmationHeader="Activate User"
                        confirmationMessage={`Are you sure you want to activate ${userName}'s account?`}
                        confirmLabel="Yes"
                        cancelLabel="No"
                        onCancel={() => {}}
                        onConfirm={handleActivation}
                        transparent
                    >
                        Activate account
                    </DropdownMenuItem>
                )}
            </DropdownMenu>
        </div>
    );
}

export default UserActions;
