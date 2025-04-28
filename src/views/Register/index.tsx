import {
    useCallback,
    useState,
} from 'react';
import {
    Link,
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
    lengthGreaterThanCondition,
    lengthSmallerThanCondition,
    nonFieldError,
    ObjectSchema,
    requiredStringCondition,
    undefinedValue,
    useForm,
} from '@togglecorp/toggle-form';
import {
    Button,
    PasswordInput,
    TextInput,
} from '@togglecorp/toggle-ui';

import registerCover from '#assets/loginCover.png';
import Container from '#components/Container';
import Page from '#components/Page';
import {
    RegisterUserInput,
    RegisterUserMutation,
    RegisterUserMutationVariables,
} from '#generated/types/graphql';
import useAlert from '#hooks/useAlert';

import styles from './styles.module.css';

const REGISTER_MUTATION = gql`
    mutation registerUser($data: RegisterUserInput!) {
        public {
            registerUser(data: $data){
                errors
                ok
            }
        }
    }
`;

function getPasswordMatchCondition(referenceVal: string | undefined) {
    function passwordMatchCondition(val: string | undefined) {
        if (isTruthyString(val) && isTruthyString(referenceVal) && val !== referenceVal) {
            return 'Passwords do not match';
        }
        return undefined;
    }

    return passwordMatchCondition;
}

type PartialFormFields = Partial<RegisterUserInput & { confirmPassword: string}>;
type FormSchema = ObjectSchema<PartialFormFields>;
type FormSchemaFields = ReturnType<FormSchema['fields']>;

const RegisterSchema: FormSchema = ({
    fields: (value): FormSchemaFields => {
        let fields: FormSchemaFields = {
            firstName: {
                required: true,
                requiredValidation: requiredStringCondition,
            },
            password: {
                required: true,
                requiredValidation: requiredStringCondition,
                validations: [
                    lengthGreaterThanCondition(3),
                    lengthSmallerThanCondition(129),
                ],
            },
            confirmPassword: {
                required: true,
                requiredValidation: requiredStringCondition,
            },
        };
        fields = addCondition(
            fields,
            value,
            ['password'],
            ['confirmPassword'],
            (val) => ({
                confirmPassword: {
                    required: true,
                    requiredValidation: requiredStringCondition,
                    forceValue: undefinedValue,
                    validations: [getPasswordMatchCondition(val?.password)],
                },
            }),
        );

        return fields;
    },
});

/** @knipignore */
// eslint-disable-next-line import/prefer-default-export
export function Component() {
    const alert = useAlert();
    const [defaultFormValues] = useState<PartialFormFields>({});
    const { userId, registerToken } = useParams<{ userId?: string, registerToken?: string }>();
    const {
        setError,
        value,
        error: fieldError,
        setFieldValue,
        validate,
    } = useForm(RegisterSchema, { value: defaultFormValues });

    const error = getErrorObject(fieldError);

    const [
        triggerRegisterUser,
        {
            loading: registerPending,
        },
    ] = useMutation<
            RegisterUserMutation,
            RegisterUserMutationVariables
        >(REGISTER_MUTATION, {
            onCompleted: (response) => {
                const { public: publicRes } = response;
                if (!publicRes) {
                    return;
                }
                const { registerUser: registerRes } = publicRes;
                if (!registerRes) {
                    return;
                }
                const { errors, ok } = registerRes;

                if (errors) {
                    setError(fieldError);
                    const errorMessages = errors
                        ?.map((message: { messages: string; }) => message.messages)
                        .filter((message: string) => message)
                        .join(', ');
                    alert.show(errorMessages);
                } else if (ok) {
                    alert.show(
                        'Successfully created a user!',
                        { variant: 'success' },
                    );
                }
            },
            onError: (errors) => {
                setError({
                    [nonFieldError]: errors.message,
                });
                alert.show(
                    'Sorry, could not register new user right now!',
                    { variant: 'danger' },
                );
            },
        });

    const handleFormSubmit = useCallback(
        (finalValues: PartialFormFields) => {
            if (!userId) {
                alert.show(
                    'UUID is missing',
                    { variant: 'danger' },
                );
                return;
            }
            if (!registerToken) {
                // eslint-disable-next-line no-alert
                alert.show(
                    'Token is missing',
                    { variant: 'danger' },
                );
                return;
            }
            triggerRegisterUser({
                variables: {
                    data: {
                        ...finalValues,
                        uuid: userId,
                        token: registerToken,
                    } as RegisterUserInput,
                },
            });
        },
        [userId, registerToken, triggerRegisterUser, alert],
    );
    const handleSubmit = useCallback(
        () => {
            createSubmitHandler(validate, setError, handleFormSubmit)();
        },
        [validate, setError, handleFormSubmit],
    );
    return (
        <Page>
            <Container
                className={styles.banner}
                showHeader
                heading="ToggTalkie"
                headingDescription="Welcome to ToggTalkie Dashboard!"
                childrenContainerClassName={styles.coverImage}
            >
                <img
                    className={styles.coverImage}
                    src={registerCover}
                    alt="cover"
                />
            </Container>
            <Container
                showHeader
                className={styles.formContainer}
                heading="Create an account"
                childrenContainerClassName={styles.formContent}
            >
                <div className={styles.form}>
                    <TextInput
                        name="firstName"
                        label="First Name*"
                        value={value.firstName}
                        onChange={setFieldValue}
                        error={error?.firstName}
                    />
                    <TextInput
                        name="lastName"
                        label="Last Name"
                        value={value.lastName}
                        onChange={setFieldValue}
                        error={error?.lastName}
                    />
                    <PasswordInput
                        name="password"
                        label="Password*"
                        placeholder="Enter password"
                        onChange={setFieldValue}
                        value={value?.password}
                        error={error?.password}
                    />
                    <PasswordInput
                        name="confirmPassword"
                        type="password"
                        label="Confirm Password*"
                        placeholder="Enter password"
                        value={value.confirmPassword}
                        onChange={setFieldValue}
                        error={error?.confirmPassword}
                    />
                </div>
                <div className={styles.action}>
                    <Button
                        className={styles.signUp}
                        type="submit"
                        variant="primary"
                        name="save"
                        disabled={registerPending}
                        onClick={handleSubmit}
                    >
                        Sign Up
                    </Button>
                    <div className={styles.login}>
                        Already have an account?
                        <Link
                            className={styles.loginLink}
                            to="login"
                        >
                            Login
                        </Link>
                    </div>
                </div>
            </Container>
        </Page>
    );
}

Component.displayName = 'Register';
