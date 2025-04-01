import { useState } from 'react';
import {
    IoEllipsisVertical,
    IoPencil,
} from 'react-icons/io5';
import {
    gql,
    useMutation,
} from '@apollo/client';
import { isNotDefined } from '@togglecorp/fujs';
import { Button } from '@togglecorp/toggle-ui';

import DropdownMenu from '#components/DropdownMenu';
import DropdownMenuItem from '#components/DropdownMenuItem';
import {
    PasswordResetTriggerMutation,
    PasswordResetTriggerMutationVariables,
    ResendInviteMutation,
    ResendInviteMutationVariables,
    UserPasswordResetTriggerInput,
    UserResendInviteInput,
} from '#generated/types/graphql';
import useAlert from '#hooks/useAlert';

import EditUserModal from '../EditUserModal';
import ConfirmationModal from './ConfirmationModal';

import styles from './styles.module.css';

interface UserActionsProps {
    userId: string;
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
const RESEND_INVITE = gql`
  mutation ResendInvite($data: UserResendInviteInput!) {
    public {
      resendInvite(data: $data) {
        ok
        errors
      }
    }
  }
`;

function UserActions({
    userId, userName, isActive,
}: UserActionsProps) {
    // Note : We Have to replace useState  with useBooleanState
    const [showEditModal, setShowEditModal] = useState(false);
    const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
    const [showResendInviteModal, setShowResendInviteModal] = useState(false);

    const alert = useAlert();

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
    const [triggerResendInvite] = useMutation<
        ResendInviteMutation,
        ResendInviteMutationVariables
    >(
        RESEND_INVITE,
        {
            onCompleted: (response) => {
                const { errors, ok } = response.public.resendInvite;
                if (errors) {
                    alert.show(
                        'Resend Invite failed',
                        { variant: 'danger' },
                    );
                } else if (ok) {
                    alert.show(
                        'Resend invitation email sent successfully',
                        { variant: 'success' },
                    );
                }
            },
            onError: () => {
                alert.show(
                    'Resend Invite failed',
                    { variant: 'danger' },
                );
            },
        },
    );

    const handlePasswordReset = () => {
        if (isNotDefined(userId)) {
            alert.show(
                'User ID is required to reset password',
                { variant: 'danger' },
            );
            return;
        }

        triggerPasswordReset({
            variables: {
                input: { userId } as UserPasswordResetTriggerInput,
            },
        });
    };

    const handleResendInvite = () => {
        if (isNotDefined(userId)) {
            alert.show(
                'User ID is required to resend invite',
                { variant: 'danger' },
            );
            return;
        }
        triggerResendInvite({
            variables: {
                data: { userId } as UserResendInviteInput,
            },
        });
    };

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
                icons={<IoEllipsisVertical />}
            >
                {isActive ? (
                    <DropdownMenuItem
                        type="button"
                        name="deactivation"
                        onClick={() => {}}
                    >
                        Deactivate account
                    </DropdownMenuItem>
                ) : (
                    <>
                        <DropdownMenuItem
                            type="button"
                            name="resendInvite"
                            onClick={() => setShowResendInviteModal(true)}
                        >
                            Resend Invite
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            type="button"
                            name="activation"
                            onClick={() => {}}
                        >
                            Activate Account
                        </DropdownMenuItem>
                    </>
                )}
                <DropdownMenuItem
                    type="button"
                    name="resetPassword"
                    onClick={() => setShowResetPasswordModal(true)}
                >
                    Reset Password
                </DropdownMenuItem>
            </DropdownMenu>

            {showEditModal && (
                <EditUserModal
                    onClose={() => setShowEditModal(false)}
                />
            )}

            {showResetPasswordModal && (
                <ConfirmationModal
                    confirmationHeading="Reset Password"
                    confirmationMessage={`Reset password for ${userName}?`}
                    onClose={() => setShowResetPasswordModal(false)}
                    onConfirm={() => {
                        handlePasswordReset();
                        setShowResetPasswordModal(false);
                    }}
                />
            )}

            {showResendInviteModal && (
                <ConfirmationModal
                    confirmationHeading="Resend Invite"
                    confirmationMessage={`Resend invite to ${userName}?`}
                    onClose={() => setShowResendInviteModal(false)}
                    onConfirm={() => {
                        handleResendInvite();
                        setShowResendInviteModal(false);
                    }}
                />
            )}
        </div>
    );
}

export default UserActions;
