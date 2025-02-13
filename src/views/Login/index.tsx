import {
    useCallback,
    useContext,
} from 'react';
import {
    gql,
    useMutation,
} from '@apollo/client';
import {
    createSubmitHandler,
    emailCondition,
    getErrorObject,
    lengthGreaterThanCondition,
    lengthSmallerThanCondition,
    nonFieldError,
    ObjectSchema,
    PartialForm,
    removeNull,
    requiredStringCondition,
    useForm,
} from '@togglecorp/toggle-form';
import {
    Button,
    PasswordInput,
    TextInput,
} from '@togglecorp/toggle-ui';

import loginCover from '#assets/loginCover.png';
import Container from '#components/Container';
import Page from '#components/Page';
import UserContext from '#contexts/user';
import {
    LoginMutation,
    LoginMutationVariables,
} from '#generated/types/graphql';

import styles from './styles.module.css';

const LOGIN = gql`
    mutation Login($input: LoginInput!){
        public {
            login(data: $input) {
                ok
                errors
                result {
                    displayName
                    email
                    firstName
                    id
                    lastName
                }
            }
        }
    }
`;

type PartialFormType = PartialForm<LoginMutationVariables['input']>
type FormSchema = ObjectSchema<PartialFormType>;
type FormSchemaFields = ReturnType<FormSchema['fields']>;

const LoginSchema: FormSchema = ({
    fields: (): FormSchemaFields => ({
        email: {
            required: true,
            requiredValidation: requiredStringCondition,
            validations: [emailCondition],
        },
        password: {
            required: true,
            requiredValidation: requiredStringCondition,
            validations: [
                lengthGreaterThanCondition(1),
                lengthSmallerThanCondition(129),
            ],
        },
    }),
});

const defaultFormValues: PartialFormType = {};

/** @knipignore */
// eslint-disable-next-line import/prefer-default-export
export function Component() {
    const {
        pristine,
        value,
        error: riskyError,
        setFieldValue,
        validate,
        setError,
    } = useForm(LoginSchema, { value: defaultFormValues });

    const error = getErrorObject(riskyError);

    const { setUserAuth } = useContext(UserContext);

    const [
        login,
        { loading },
    ] = useMutation<LoginMutation, LoginMutationVariables>(
        LOGIN,
        {
            onCompleted: (response) => {
                const { login: loginRes } = response.public;
                if (!loginRes) {
                    return;
                }

                const {
                    errors,
                    result,
                    ok,
                } = loginRes;

                if (errors) {
                    // const formError = transformToFormError(removeNull(errors) as ObjectError[]);
                    setError(error);
                } else if (ok) {
                    const safeUser = removeNull(result);
                    setUserAuth(safeUser);
                }
            },
            onError: (errors) => {
                setError({
                    [nonFieldError]: errors.message,
                });
            },
        },
    );

    const handleSubmit = useCallback((finalValue: PartialFormType) => {
        login({
            variables: {
                input: finalValue as LoginMutationVariables['input'],
            },
        });
    }, [login]);

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
                    src={loginCover}
                    alt="cover"
                />
            </Container>
            <Container
                showHeader
                className={styles.formContainer}
                heading="Welcome back"
                childrenContainerClassName={styles.formContent}
            >
                <form
                    className={styles.form}
                    onSubmit={createSubmitHandler(validate, setError, handleSubmit)}
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
                    <PasswordInput
                        name="password"
                        label="Password*"
                        placeholder="Enter password"
                        onChange={setFieldValue}
                        value={value?.password}
                        error={error?.password}
                    />
                    <Button
                        className={styles.loginButton}
                        disabled={pristine || loading}
                        type="submit"
                        variant="primary"
                        name="login"
                    >
                        Submit
                    </Button>
                </form>
            </Container>
        </Page>
    );
}

Component.displayName = 'Login';
