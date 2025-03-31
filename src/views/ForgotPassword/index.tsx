import {
    useMemo,
    useState,
} from 'react';
import { Link } from 'react-router-dom';
import {
    gql,
    useMutation,
} from '@apollo/client';
import {
    createSubmitHandler,
    emailCondition,
    getErrorObject,
    nonFieldError,
    ObjectSchema,
    PartialForm,
    requiredStringCondition,
    useForm,
} from '@togglecorp/toggle-form';
import {
    Button,
    Message,
    TextInput,
} from '@togglecorp/toggle-ui';

import loginCover from '#assets/loginCover.png';
import organizationName from '#assets/organizationName.svg';
import Container from '#components/Container';
import Page from '#components/Page';
import {
    ForgotPasswordMutation,
    ForgotPasswordMutationVariables,
    ResetUserPassword,
} from '#generated/types/graphql';
import useAlert from '#hooks/useAlert';
import { transformToFormError } from '#utils/errorTransform';

import styles from './styles.module.css';

const FORGOT_PASSWORD = gql`
  mutation forgotPassword($input: ResetUserPassword!) {
    public {
        forgotPassword(data: $input) {
        errors
        ok
      }
    }
  }
`;
type PartialFormType = PartialForm<ResetUserPassword>
type FormSchema = ObjectSchema<PartialFormType>;
type FormSchemaFields = ReturnType<FormSchema['fields']>;

const ForgotPasswordSchema: FormSchema = ({
    fields: (): FormSchemaFields => ({
        email: {
            required: true,
            requiredValidation: requiredStringCondition,
            validations: [emailCondition],
        },
    }),
});

const defaultFormValues: PartialFormType = {};

/** @knipignore */
// eslint-disable-next-line import/prefer-default-export
export function Component() {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const alert = useAlert();
    const {
        pristine,
        value,
        error: riskyError,
        setFieldValue,
        validate,
        setError,
    } = useForm(ForgotPasswordSchema, { value: defaultFormValues });

    const error = getErrorObject(riskyError);

    const [
        requestPasswordRecovery,
        { loading },
    ] = useMutation<ForgotPasswordMutation, ForgotPasswordMutationVariables>(
        FORGOT_PASSWORD,
        {
            onCompleted: (response) => {
                const {
                    public: { forgotPassword },
                } = response;
                if (forgotPassword?.ok) {
                    setIsSubmitted(true);
                } else if (forgotPassword.errors) {
                    const formErrors = transformToFormError(forgotPassword.errors);
                    setError(formErrors);
                    alert.show(
                        'Could not recover account!',
                        { variant: 'danger' },
                    );
                }
            },
            onError: (passwordError) => {
                setError({ [nonFieldError]: passwordError.message });
                alert.show(
                    'Could not recover account!',
                    { variant: 'danger' },
                );
            },
        },
    );

    const handleSubmit = useMemo(
        () => createSubmitHandler(
            validate,
            setError,
            (formValues: PartialFormType) => {
                requestPasswordRecovery({
                    variables: {
                        input: {
                            email: formValues.email,
                        } as ResetUserPassword,
                    },
                });
            },
        ),
        [validate, setError, requestPasswordRecovery],
    );
    if (isSubmitted) {
        return (
            <Container className={styles.userForgotPassword}>
                <Message
                    message=" Account recovery submitted! Please check your email for further action!"
                />
            </Container>
        );
    }

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
                heading="Forgot Your Password?"
                headingDescription="Enter your email to  reset it"
                childrenContainerClassName={styles.formContent}
            >
                <form
                    className={styles.form}
                    onSubmit={handleSubmit}
                >
                    <TextInput
                        name="email"
                        label="Email*"
                        placeholder="Enter email"
                        onChange={setFieldValue}
                        value={value?.email}
                        error={error?.email}
                        autoFocus
                    />
                    <Button
                        className={styles.loginButton}
                        disabled={pristine || loading}
                        type="submit"
                        variant="primary"
                        name="login"
                    >
                        Confirm
                    </Button>
                    <div className={styles.signup}>
                        <p>  Return back to</p>
                        <Link
                            className={styles.link}
                            to="/login"
                        >
                            Login
                        </Link>
                    </div>
                </form>
            </Container>
        </Page>
    );
}

Component.displayName = 'ForgotPassword';
