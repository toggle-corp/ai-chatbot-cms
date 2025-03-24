import { useCallback } from 'react';
import { IoEllipsisVertical } from 'react-icons/io5';
import {
    gql,
    useMutation,
} from '@apollo/client';

import DropdownMenu from '#components/DropdownMenu';
import DropdownMenuItem from '#components/DropdownMenuItem';
import {
    PasswordResetTriggerMutation,
    PasswordResetTriggerMutationVariables,
} from '#generated/types/graphql';
import useAlert from '#hooks/useAlert';

import styles from './styles.module.css';

interface UserActionsProps {
  userName: string;
  isActivated:boolean;
}

const USER_RESET_PASSWORD_MUTATION = gql`
  mutation passwordResetTrigger($input: UserPasswordResetInput!) {
    public {
      passwordResetTrigger(data: $input) {
        errors
        ok
      }
    }
  }
`;

function UserActions({ userName, isActivated }: UserActionsProps) {
    const alert = useAlert();
    const [triggerResetPassword] = useMutation<
      PasswordResetTriggerMutation,
      PasswordResetTriggerMutationVariables
    >(
        USER_RESET_PASSWORD_MUTATION,
        {
            onCompleted: (response) => {
                const { errors, ok } = response.public.passwordResetTrigger;
                if (errors) {
                    alert.show(
                        'Password reset failed',
                        { variant: 'danger' },
                    );
                } else if (ok) {
                    alert.show(
                        'Password reset link sent',
                        { variant: 'success' },
                    );
                }
            },
            onError: () => {
                alert.show(
                    'Password reset failed',
                    { variant: 'danger' },
                );
            },
        },
    );

    const handleResetPassword = useCallback(() => {
        triggerResetPassword({
            variables: {
                input: {
                    email: '',
                },
            },
        });
    }, [triggerResetPassword]);

    return (
        <div className={styles.userActions}>
            <DropdownMenu
                withoutDropdownIcon
                icons={(
                    <IoEllipsisVertical />
                )}
            >
                {isActivated ? (
                    <DropdownMenuItem
                        type="confirm-button"
                        name="deactivation"
                        confirmationHeader="Deactivate User"
                        confirmationMessage={`Are you sure you want to deactivate ${userName}'s account?`}
                        confirmLabel="Yes"
                        cancelLabel="No"
                        onCancel={() => {}}
                        onConfirm={() => {}}
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
                        onConfirm={() => {}}
                        transparent
                    >
                        Activate account
                    </DropdownMenuItem>
                )}
                <DropdownMenuItem
                    type="confirm-button"
                    name="resendInvite"
                    confirmationHeader="Resend Invite"
                    confirmationMessage={`Resend Invite to ${userName}?`}
                    confirmLabel="Yes"
                    cancelLabel="No"
                    onCancel={() => {}}
                    onConfirm={() => {}}
                    transparent
                >
                    Resend invite
                </DropdownMenuItem>
                <DropdownMenuItem
                    type="confirm-button"
                    name="resetPassword"
                    confirmationHeader="Reset Password"
                    confirmationMessage={`Reset Password for ${userName}?`}
                    confirmLabel="Yes"
                    cancelLabel="No"
                    onCancel={() => {}}
                    onConfirm={handleResetPassword}
                    transparent
                >
                    Reset password
                </DropdownMenuItem>
            </DropdownMenu>
        </div>
    );
}

export default UserActions;
