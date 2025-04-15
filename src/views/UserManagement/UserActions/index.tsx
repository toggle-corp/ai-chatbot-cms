import {
    IoEllipsisVertical,
    IoPencil,
} from 'react-icons/io5';
import { useParams } from 'react-router-dom';
import {
    gql,
    useMutation,
} from '@apollo/client';
import { isNotDefined } from '@togglecorp/fujs';
import { Button } from '@togglecorp/toggle-ui';

import DropdownMenu from '#components/DropdownMenu';
import DropdownMenuItem from '#components/DropdownMenuItem';
import {
    AccountDeactivationMutation,
    AccountDeactivationMutationVariables,
    PasswordResetTriggerMutation,
    PasswordResetTriggerMutationVariables,
    ResendInviteMutation,
    ResendInviteMutationVariables,
    UserActivationInput,
    UserDeactivationInput,
    UserPasswordResetTriggerInput,
    UserResendInviteInput,
} from '#generated/types/graphql';
import useAlert from '#hooks/useAlert';
import useBooleanState from '#hooks/useBooleanState';

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
const DEACTIVATE_ACCOUNT = gql`
  mutation AccountDeactivation($data: UserDeactivationInput!) {
    public {
        accountDeactivation(data: $data) {
            ok
            errors
        }
    }
  }
`;

function UserActions({
    userId, userName, isActive,
}: UserActionsProps) {
    const alert = useAlert();
    const { uuid, token } = useParams<{ uuid: string, token?: string }>();

    const [showEditModal,
        {
            setTrue: setShowEditModalTrue,
            setFalse: setShowEditModalFalse,
        }] = useBooleanState(false);
    const [showResetPasswordModal,
        {
            setTrue: setResetPasswordModalTrue,
            setFalse: setResetPasswordModalFalse,
        }] = useBooleanState(false);
    const [showResendInviteModal,
        {
            setTrue: setResendInviteModalTrue,
            setFalse: setResendInviteModalFalse,
        }] = useBooleanState(false);
    const [showDeactivateModal,
        {
            setTrue: setDeactivateModalTrue,
            setFalse: setDeactivateModalFalse,
        }] = useBooleanState(false);
    const [
        triggerPasswordReset,
    ] = useMutation<PasswordResetTriggerMutation, PasswordResetTriggerMutationVariables>(
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
    const [
        triggerResendInvite,
    ] = useMutation<ResendInviteMutation, ResendInviteMutationVariables>(
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
    const [
        triggerDeactivateAccount,
    ] = useMutation<AccountDeactivationMutation, AccountDeactivationMutationVariables>(
        DEACTIVATE_ACCOUNT,
        {
            onCompleted: (response) => {
                const { ok, errors } = response.public.accountDeactivation;
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

    const handleDeactivate = () => {
        if (isNotDefined(userId)) {
            alert.show(
                'User ID is required to deactivate account',
                { variant: 'danger' },
            );
            return;
        }
        triggerDeactivateAccount({
            variables: {
                data: { userId } as UserDeactivationInput,
            },
        });
    };

    return (
        <div className={styles.userActions}>
            <Button
                name={undefined}
                onClick={setShowEditModalTrue}
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
                        onClick={setDeactivateModalTrue}
                    >
                        Deactivate account
                    </DropdownMenuItem>
                ) : (
                    <DropdownMenuItem
                        type="button"
                        name="resendInvite"
                        onClick={setResendInviteModalTrue}
                    >
                        Resend Invite
                    </DropdownMenuItem>
                )}
                <DropdownMenuItem
                    type="button"
                    name="resetPassword"
                    onClick={setResetPasswordModalTrue}
                >
                    Reset Password
                </DropdownMenuItem>
            </DropdownMenu>

            {showEditModal && (
                <EditUserModal
                    onClose={setShowEditModalFalse}
                />
            )}

            {showResetPasswordModal && (
                <ConfirmationModal
                    confirmationHeading="Reset Password"
                    confirmationMessage={`Reset password for ${userName}?`}
                    onClose={setResetPasswordModalFalse}
                    onConfirm={() => {
                        handlePasswordReset();
                        setResetPasswordModalFalse();
                    }}
                />
            )}

            {showResendInviteModal && (
                <ConfirmationModal
                    confirmationHeading="Resend Invite"
                    confirmationMessage={`Resend invite to ${userName}?`}
                    onClose={setResendInviteModalFalse}
                    onConfirm={() => {
                        handleResendInvite();
                        setResendInviteModalFalse();
                    }}
                />
            )}
            {showDeactivateModal && (
                <ConfirmationModal
                    confirmationHeading="Deactivate User"
                    confirmationMessage={`Are you sure you want to deactivate ${userName}'s account?`}
                    onClose={setDeactivateModalFalse}
                    onConfirm={() => {
                        handleDeactivate();
                        setDeactivateModalFalse();
                    }}
                />
            )}
        </div>
    );
}

export default UserActions;
