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
    UserPasswordResetInput,
} from '#generated/types/graphql';
import useAlert from '#hooks/useAlert';

import styles from './styles.module.css';

interface UserActionsProps {
  userName: string;
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

function UserActions({ userName }: UserActionsProps) {
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
                    alert.show('Password reset link sent', { variant: 'success' });
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

    const handleResetPassword = useCallback((
        name: 'resetPassword',
    ) => {
        triggerResetPassword({
            variables: {
                input: name as unknown as UserPasswordResetInput,
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
