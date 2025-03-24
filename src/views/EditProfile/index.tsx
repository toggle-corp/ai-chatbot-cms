import React, {
    useCallback,
    useContext,
} from 'react';
import {
    gql,
    useMutation,
} from '@apollo/client';
import {
    createSubmitHandler,
    getErrorObject,
    ObjectSchema,
    PartialForm,
    requiredStringCondition,
    useForm,
} from '@togglecorp/toggle-form';
import {
    Button,
    TextInput,
} from '@togglecorp/toggle-ui';

import displayImage from '#assets/displayImage.svg';
import Container from '#components/Container';
import Page from '#components/Page';
import UserContext from '#contexts/user';
import {
    UpdateMeMutation,
    UpdateMeMutationVariables,
    UserMeInput,
} from '#generated/types/graphql';
import useAlert from '#hooks/useAlert';

import styles from './styles.module.css';

const UPDATE_ME = gql`
    mutation UpdateMe($input: UserMeInput!) {
        private {
            updateMe(data: $input) {
                errors
                ok
                result {
                    email
                    firstName
                    lastName
                }
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
    }),
};

/** @knipignore */
// eslint-disable-next-line import/prefer-default-export
export function Component() {
    const { userAuth } = useContext(UserContext);
    const alert = useAlert();
    const defaultFormValues: PartialFormType = {
        email: userAuth?.email || '',
    };

    const {
        pristine,
        value,
        error: formError,
        setFieldValue,
        validate,
        setError,
        setValue,
    } = useForm(EditProfileSchema, { value: defaultFormValues });

    const [
        triggerUpdateMe,
        { loading },
    ] = useMutation<UpdateMeMutation, UpdateMeMutationVariables>(
        UPDATE_ME,
        {
            onCompleted: (projectResponse) => {
                const response = projectResponse?.private?.updateMe;
                if (!response) {
                    return;
                }
                if (response.ok) {
                    setValue((prevValue) => ({
                        ...prevValue,
                        email: response.result?.email ?? '',
                    }));
                    alert.show(
                        'Updated Successfully',
                        {
                            variant: 'success',
                        },
                    );
                } else {
                    const errorMessages = response?.errors
                        ?.map((error: { messages: string; }) => error.messages)
                        .filter((message: string) => message)
                        .join(', ');
                    alert.show(errorMessages, { variant: 'danger' });
                }
            },
            onError: () => {
                alert.show(
                    'Failed to Update',
                    { variant: 'danger' },
                );
            },
        },
    );

    const handleUpdateUserSubmit = useCallback((finalValue: PartialFormType) => {
        triggerUpdateMe({
            variables: {
                input: finalValue as UserMeInput,
            },
        });
    }, [triggerUpdateMe]);

    const handleSubmit = (_name: 'save', e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        createSubmitHandler(validate, setError, handleUpdateUserSubmit)();
    };

    const error = getErrorObject(formError);

    return (
        <Page className={styles.mainContent}>
            <Container className={styles.editUrl}>
                <div className={styles.displayProfile}>
                    <img
                        src={displayImage}
                        alt="display"
                    />
                    {/* FIXME: Add Display name after server side ready */}
                    <div className={styles.displayContent}>
                        <h1>
                            {userAuth?.firstName}
                            {' '}
                            {userAuth?.lastName}
                        </h1>
                        <p>Hr</p>
                    </div>
                </div>

                <Container className={styles.formContent}>
                    <form className={styles.form}>
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
                        <div className={styles.actions}>
                            <Button
                                className={styles.loginButton}
                                disabled={false}
                                type="button"
                                variant="default"
                                name="cancel"
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
                                Save
                            </Button>
                        </div>
                    </form>
                </Container>
            </Container>
        </Page>
    );
}

Component.displayName = 'EditProfile';
