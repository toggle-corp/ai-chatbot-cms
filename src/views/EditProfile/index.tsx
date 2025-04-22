import React, {
    useCallback,
    useContext,
    useState,
} from 'react';
import { IoPencil } from 'react-icons/io5';
import {
    gql,
    useMutation,
} from '@apollo/client';
import {
    createSubmitHandler,
    getErrorObject,
    nonFieldError,
    ObjectSchema,
    PartialForm,
    requiredStringCondition,
    useForm,
} from '@togglecorp/toggle-form';
import {
    Avatar,
    Button,
    TextInput,
} from '@togglecorp/toggle-ui';

import Container from '#components/Container';
import Page from '#components/Page';
import UserContext from '#contexts/user';
import {
    UpdateMeMutation,
    UpdateMeMutationVariables,
    UserMeInput,
} from '#generated/types/graphql';
import useAlert from '#hooks/useAlert';
import useBooleanState from '#hooks/useBooleanState';
import { transformToFormError } from '#utils/errorTransform';

import ChangePasswordForm from './ChangePassword';

import styles from './styles.module.css';

const UPDATE_ME = gql`
    mutation UpdateMe($input: UserMeInput!) {
        private {
            updateMe(data: $input) {
                errors
                ok
            }
        }
    }
`;

type PartialFormType = PartialForm<UserMeInput> & { email: string; };

type FormSchema = ObjectSchema<PartialFormType>;
type FormSchemaFields = ReturnType<FormSchema['fields']>;

const EditProfileSchema: FormSchema = {
    fields: (): FormSchemaFields => ({
        firstName: {
            required: true,
            requiredValidation: requiredStringCondition,
        },
        lastName: {
            required: true,
            requiredValidation: requiredStringCondition,
        },
        email: {
            required: true,
            requiredValidation: requiredStringCondition,
        },
        profilePicture: {
            required: false,
        },
    }),
};

/** @knipignore */
// eslint-disable-next-line import/prefer-default-export
export function Component() {
    const { userAuth } = useContext(UserContext);
    const alert = useAlert();
    const [showChangePasswordForm, {
        setTrue: setChangePasswordFormTrue,
        setFalse: setChangePasswordFormFalse,
    }] = useBooleanState(false);

    const defaultFormValues: PartialFormType = {
        email: userAuth?.email || '',
    };
    const [
        profilePicturePreview,
        setProfilePicturePreview,
    ] = useState<string | undefined>(undefined);

    const {
        pristine,
        value,
        error: formError,
        setFieldValue,
        validate,
        setError,
    } = useForm(EditProfileSchema, { value: defaultFormValues });

    const [
        triggerUpdateMe,
        { loading },
    ] = useMutation<UpdateMeMutation, UpdateMeMutationVariables>(
        UPDATE_ME,
        {
            onCompleted: (response) => {
                if (response.private.updateMe.ok) {
                    alert.show(
                        'Successfully updated!',
                        { variant: 'success' },
                    );
                } else {
                    setError(transformToFormError(response.private.updateMe.errors));
                    const errorMessages = response.private.updateMe.errors
                        ?.map((error: { messages: string }) => error.messages)
                        .filter((message: string) => message)
                        .join(', ');
                    alert.show(errorMessages, { variant: 'danger' });
                }
            },
            onError: (errors) => {
                setError({ [nonFieldError]: errors.message });
                alert.show(
                    'There was an error updating!',
                    { variant: 'danger' },
                );
            },
        },
    );

    const handleUpdateUserSubmit = useCallback((finalValue: PartialFormType) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { email, ...inputWithoutEmail } = finalValue;

        const variables: UpdateMeMutationVariables = {
            input: {
                ...inputWithoutEmail,
                profilePicture: finalValue.profilePicture,
            } as UserMeInput,
        };

        triggerUpdateMe({
            variables,
            context: {
                hasUpload: true,
            },
        });
    }, [triggerUpdateMe]);

    const handleProfileImageChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            const image = event.target.files?.[0];
            if (image) {
                const imageBlob = URL.createObjectURL(image);
                setProfilePicturePreview(imageBlob);
                setFieldValue(image, 'profilePicture');
            } else {
                setProfilePicturePreview(undefined);
                setFieldValue(null, 'profilePicture');
            }
        },
        [setFieldValue],
    );

    const handleSubmit = useCallback(() => {
        if (showChangePasswordForm) {
            const changePasswordForm = document.querySelector('form');
            if (changePasswordForm) {
                changePasswordForm.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
            }
        } else {
            createSubmitHandler(validate, setError, handleUpdateUserSubmit)();
        }
    }, [showChangePasswordForm, handleUpdateUserSubmit, setError, validate]);

    const handleProfilePictureClick = useCallback(() => {
        document.getElementById('profilePictureInput')?.click();
    }, []);

    const error = getErrorObject(formError);

    return (
        <Page className={styles.mainContent}>
            <Container className={styles.editUrl}>
                <div className={styles.displayProfile}>
                    <div className={styles.profileUpdate}>
                        <Avatar
                            src={profilePicturePreview}
                            alt={`${value.firstName} ${value.lastName}`}
                            className={styles.profileImage}
                        />
                        <input
                            name="profilePicture"
                            type="file"
                            accept="image/*"
                            style={{ display: 'none' }}
                            id="profilePictureInput"
                            onChange={handleProfileImageChange}
                        />
                        <Button
                            name="edit"
                            className={styles.editButton}
                            variant="default"
                            onClick={handleProfilePictureClick}
                            icons={<IoPencil />}
                        >
                            Edit
                        </Button>
                    </div>
                    <div className={styles.displayContent}>
                        <h1>
                            {userAuth?.firstName}
                            {' '}
                            {userAuth?.lastName}
                        </h1>
                    </div>
                </div>

                <Container
                    className={styles.formContent}
                    showHeader
                    headingDescription={(
                        <div className={styles.form}>
                            <TextInput
                                className={styles.fullSizeInput}
                                label="Email"
                                name="email"
                                autoFocus
                                value={value?.email}
                                error={error?.email}
                                readOnly
                            />
                            <TextInput
                                name="firstName"
                                label="First Name"
                                value={value?.firstName}
                                error={error?.firstName}
                                onChange={setFieldValue}
                            />
                            <TextInput
                                name="lastName"
                                value={value?.lastName}
                                label="Last Name"
                                error={error?.lastName}
                                onChange={setFieldValue}
                            />
                        </div>
                    )}
                    withHeaderBorder
                    footerContent={(
                        <div className={styles.actions}>
                            <Button
                                name="cancel"
                                className={styles.loginButton}
                                type="button"
                                variant="default"
                                onClick={setChangePasswordFormFalse}
                            >
                                Cancel
                            </Button>
                            <Button
                                name="save"
                                className={styles.loginButton}
                                disabled={pristine || loading}
                                type="button"
                                variant="primary"
                                onClick={handleSubmit}
                            >
                                Save Changes
                            </Button>
                        </div>
                    )}
                >
                    {!showChangePasswordForm ? (
                        <Button
                            name="changePassword"
                            type="button"
                            variant="default"
                            onClick={setChangePasswordFormTrue}
                            transparent
                        >
                            Change Password
                        </Button>
                    ) : (
                        <ChangePasswordForm />
                    )}
                </Container>
            </Container>
        </Page>
    );
}

Component.displayName = 'EditProfile';
