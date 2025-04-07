import {
    useCallback,
    useContext,
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
    removeNull,
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

type PartialFormType = PartialForm<UserMeInput> & { email: string };

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

    const {
        pristine,
        value,
        setPristine,
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
                const { private: privateRes } = response;
                if (!privateRes) {
                    return;
                }
                const { updateMe: updateMeRes } = privateRes;
                if (!updateMeRes) return;
                const { errors, ok } = updateMeRes;
                if (errors) {
                    const formErrors = transformToFormError(removeNull(errors));
                    setError(formErrors);
                    const errorMessages = errors
                        ?.map((message: { messages: string; }) => message.messages)
                        .filter((msg: string) => msg)
                        .join(', ');
                    alert.show(errorMessages);
                } else if (ok) {
                    setPristine(true);
                    alert.show(
                        'Successfully updated!',
                        { variant: 'success' },
                    );
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
        triggerUpdateMe({ variables });
    }, [triggerUpdateMe]);

    const handleProfilePictureChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setFieldValue('profilePicture', file);
        }
    }, [setFieldValue]);

    const handleSubmit = (_name: 'save', e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        createSubmitHandler(validate, setError, handleUpdateUserSubmit)();
    };

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
                            src={value.profilePicture}
                            alt={`${value.firstName} ${value.lastName}`}
                            className={styles.profileImage}
                        />
                        <input
                            type="file"
                            accept="image/*"
                            value={value.profilePicture}
                            style={{ display: 'none' }}
                            id="profilePictureInput"
                            onChange={handleProfilePictureChange}
                        />
                        <Button
                            className={styles.editButton}
                            variant="default"
                            name={undefined}
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
                                className={styles.loginButton}
                                disabled={false}
                                type="button"
                                variant="default"
                                name="cancel"
                                onClick={setChangePasswordFormFalse}
                            >
                                Cancel
                            </Button>
                            <Button
                                className={styles.loginButton}
                                disabled={pristine || loading}
                                type="button"
                                variant="primary"
                                name="save"
                                onClick={handleSubmit}
                            >
                                Save Changes
                            </Button>
                        </div>
                    )}
                >
                    <Button
                        type="button"
                        variant="default"
                        name="ChangePassword"
                        onClick={setChangePasswordFormTrue}
                        transparent
                    >
                        Change Password
                    </Button>
                    {showChangePasswordForm && (
                        <ChangePasswordForm />
                    )}
                </Container>
            </Container>
        </Page>
    );
}

Component.displayName = 'EditProfile';
