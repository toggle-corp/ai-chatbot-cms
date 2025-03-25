import { useCallback } from 'react';
import {
    Link,
    useNavigate,
    useParams,
} from 'react-router-dom';
import {
    gql,
    useMutation,
} from '@apollo/client';
import { isTruthyString } from '@togglecorp/fujs';
import {
    addCondition,
    createSubmitHandler,
    getErrorObject,
    ObjectSchema,
    PartialForm,
    requiredStringCondition,
    undefinedValue,
    useForm,
} from '@togglecorp/toggle-form';
import {
    Button,
    PasswordInput,
} from '@togglecorp/toggle-ui';

import loginCover from '#assets/loginCover.png';
import organizationName from '#assets/organizationName.svg';
import Container from '#components/Container';
import Page from '#components/Page';
import {
    PasswordResetConfirmMutation,
    PasswordResetConfirmMutationVariables,
    UserPasswordResetConfirmInput,
} from '#generated/types/graphql';
import useAlert from '#hooks/useAlert';
import { transformToFormError } from '#utils/errorTransform';

import styles from './styles.module.css';

interface FormFields {
    newPassword?: string;
    confirmPassword?: string;
}
const PASSWORD_RESET_CONFIRM_MUTATION = gql`
    mutation PasswordResetConfirm($data: UserPasswordResetConfirmInput!) {
        public {
            passwordResetConfirm(data: $data) {
                errors
                ok
            }
        }
    }
`;
type FormType = Partial<UserPasswordResetConfirmInput & { confirmPassword: string }>;
type FormSchema = ObjectSchema<FormType>;
type FormSchemaFields = ReturnType<FormSchema['fields']>;

function getPasswordMatchCondition(referenceVal: string | undefined) {
    return (val: string | undefined) => {
        if (isTruthyString(val) && isTruthyString(referenceVal) && val !== referenceVal) {
            return 'Passwords do not match';
        }
        return undefined;
    };
}

const formSchema: FormSchema = {
    fields: (value): FormSchemaFields => {
        let baseSchema = {
            newPassword: {
                required: true,
                requiredValidation: requiredStringCondition,
            },
            confirmPassword: {
                required: true,
                requiredValidation: requiredStringCondition,
            },
        } as FormSchemaFields;

        baseSchema = addCondition(
            baseSchema,
            value,
            ['newPassword'],
            ['confirmPassword'],
            (val) => ({
                confirmPassword: {
                    required: true,
                    requiredValidation: requiredStringCondition,
                    forceValue: undefinedValue,
                    validations: [getPasswordMatchCondition(val?.newPassword)],
                },
            }),
        );

        return baseSchema;
    },
};
const defaultFormValues: PartialForm<FormFields> = {};

/** @knipignore */
// eslint-disable-next-line import/prefer-default-export
export function Component() {
    const navigate = useNavigate();
    const { userId, resetToken } = useParams<{ userId?: string, resetToken?: string }>();
    const alert = useAlert();
    const {
        pristine,
        value: formValue,
        error: formError,
        setFieldValue,
        setError,
        validate,
    } = useForm(formSchema, { value: defaultFormValues });

    const [passwordResetConfirm, { loading }] = useMutation<
        PasswordResetConfirmMutation,
        PasswordResetConfirmMutationVariables
    >(PASSWORD_RESET_CONFIRM_MUTATION, {
        onCompleted: (data) => {
            if (data.public.passwordResetConfirm.ok) {
                alert.show(
                    'Password Changed!',
                    {
                        variant: 'success',
                    },
                );
                navigate('/login');
            } else {
                setError(transformToFormError(
                    data.public.passwordResetConfirm.errors,
                ));
                const errorMessages = data.public.passwordResetConfirm?.errors
                    ?.map((error: { messages: string; }) => error.messages)
                    .filter((message: string) => message)
                    .join(', ');
                alert.show(errorMessages, { variant: 'danger' });
            }
        },
        onError: () => {
            alert.show(
                'Could not change password!',
                { variant: 'danger' },
            );
        },
    });
    const handleChangePassword = useCallback(
        (formValues: FormFields) => {
            if (!userId) {
                alert.show(
                    'Uuid is missing',
                    { variant: 'warning' },
                );
                return;
            }
            if (!resetToken) {
                alert.show(
                    'tokenMissingMessage',
                    { variant: 'warning' },
                );
                return;
            }
            passwordResetConfirm({
                variables: {
                    data: {
                        newPassword: formValues.newPassword,
                        token: resetToken,
                        uuid: userId,
                    } as UserPasswordResetConfirmInput,
                },
            });
        },
        [passwordResetConfirm, userId, resetToken, alert],
    );
    const handleSubmit = createSubmitHandler(validate, setError, handleChangePassword);

    const fieldError = getErrorObject(formError);

    return (
        <Page>
            <Container
                className={styles.banner}
                showHeader
                heading={(
                    <img
                        src={organizationName}
                        alt="cover"
                    />
                )}
                headingDescription="Welcome to ToggleHR Chatbot Dashboard!"
                childrenContainerClassName={styles.coverImage}
            >
                <img
                    className={styles.coverImage}
                    src={loginCover}
                    alt="cover"
                />
            </Container>
            <Container
                showHeader
                className={styles.formContainer}
                heading="Change Password"
                childrenContainerClassName={styles.formContent}
            >
                <form
                    className={styles.form}
                    onSubmit={handleSubmit}
                >
                    <PasswordInput
                        name="newPassword"
                        label="New Password"
                        value={formValue.newPassword}
                        onChange={setFieldValue}
                        error={fieldError?.newPassword}
                        disabled={loading}
                        autoFocus
                    />
                    <PasswordInput
                        name="confirmPassword"
                        label="Confirm new Password"
                        value={formValue.confirmPassword}
                        onChange={setFieldValue}
                        error={fieldError?.confirmPassword}
                        disabled={loading}
                    />
                    <Button
                        className={styles.loginButton}
                        disabled={pristine || loading}
                        type="submit"
                        variant="primary"
                        name="save"
                    >
                        Save changes
                    </Button>
                    <div className={styles.signup}>
                        Return back to
                        <Link
                            className={styles.link}
                            to="/login"
                        >
                            login
                        </Link>
                    </div>
                </form>
            </Container>
        </Page>
    );
}

Component.displayName = 'ForgotPasswordConfirm';
