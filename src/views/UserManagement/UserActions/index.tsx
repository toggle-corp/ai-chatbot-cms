import {
    useCallback,
    useState,
} from 'react';
import {
    IoEllipsisVertical,
    IoPencil,
} from 'react-icons/io5';
import { useParams } from 'react-router-dom';
import {
    gql,
    useMutation,
} from '@apollo/client';
import { Button } from '@togglecorp/toggle-ui';

import DropdownMenu from '#components/DropdownMenu';
import DropdownMenuItem from '#components/DropdownMenuItem';
import {
    PasswordResetTriggerMutation,
    PasswordResetTriggerMutationVariables,
    UserPasswordResetTriggerInput,
} from '#generated/types/graphql';
import useAlert from '#hooks/useAlert';

import EditUserModal from '../EditUserModal';

import styles from './styles.module.css';

interface UserActionsProps {
  userName: string;
  isActive: boolean;
}

const PASSWORD_RESET = gql`
  mutation PasswordResetTrigger($input: UserPasswordResetTriggerInput!) {
    public {
      passwordResetTrigger(data: $input) {
        ok
        errors
      }
    }
  }
`;

function UserActions(props: UserActionsProps) {
    const { userName, isActive } = props;
    const [showEditModal, setShowEditModal] = useState(false);
    const { userId } = useParams<{
        userId?: string,
    }>();
    const alert = useAlert();

    const handleUserFormModalClose = useCallback(
        () => {
            setShowEditModal(false);
        },
        [],
    );

    const [triggerPasswordReset] = useMutation<
        PasswordResetTriggerMutation,
        PasswordResetTriggerMutationVariables
    >(
        PASSWORD_RESET,
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
                        'Password reset email sent successfully',
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

    const handlePasswordReset = useCallback(() => {
        if (userId) {
            triggerPasswordReset({
                variables: {
                    input: {
                        userId,
                    } as UserPasswordResetTriggerInput,
                },
            });
        } else {
            alert.show(
                'User ID is required to reset password',
                { variant: 'danger' },
            );
        }
    }, [userId, triggerPasswordReset, alert]);

    return (
        <div className={styles.userActions}>
            <Button
                name={undefined}
                onClick={() => setShowEditModal(true)}
                title="Edit"
                transparent
            >
                <IoPencil />
            </Button>
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
                    <>
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
                        <DropdownMenuItem
                            type="confirm-button"
                            name="resendInvite"
                            confirmationHeader="Resend Invite"
                            confirmationMessage={`Resend invite to ${userName}?`}
                            confirmLabel="Yes"
                            cancelLabel="No"
                            onCancel={() => {}}
                            onConfirm={() => {}}
                            transparent
                        >
                            Resend Invite
                        </DropdownMenuItem>
                    </>
                )}
                <DropdownMenuItem
                    type="confirm-button"
                    name="resetPassword"
                    confirmationHeader="Reset Password"
                    confirmationMessage={`Reset Password for ${userName}?`}
                    confirmLabel="Yes"
                    cancelLabel="No"
                    onConfirm={handlePasswordReset}
                    transparent
                >
                    Reset Password
                </DropdownMenuItem>
            </DropdownMenu>
            {showEditModal && (
                <EditUserModal
                    onClose={handleUserFormModalClose}
                />
            )}
        </div>
    );
}

export default UserActions;
