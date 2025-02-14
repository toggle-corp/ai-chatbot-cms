import { useCallback } from 'react';
import {
    emailCondition,
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

import styles from './styles.module.css';

type PartialFormType = PartialForm<{
    email: string;
    firstName: string;
    lastName: string;
}>;

type FormSchema = ObjectSchema<PartialFormType>;
type FormSchemaFields = ReturnType<FormSchema['fields']>;

const EditFormSchema: FormSchema = {
    fields: (): FormSchemaFields => ({
        email: {
            required: true,
            requiredValidation: requiredStringCondition,
            validations: [emailCondition],
        },
        firstName: {
            required: true,
            requiredValidation: requiredStringCondition,
        },
        lastName: {
            required: true,
            requiredValidation: requiredStringCondition,
        },
    }),
};

const defaultFormValues: PartialFormType = {};

/** @knipignore */
// eslint-disable-next-line import/prefer-default-export
export function Component() {
    const {
        value,
        error: formError,
        setFieldValue,
    } = useForm(EditFormSchema, { value: defaultFormValues });

    const handleFormSubmit = useCallback(() => {}, []);

    const error = getErrorObject(formError);

    return (
        <Page
            className={styles.mainContent}
        >
            <Container
                className={styles.editUrl}
            >
                <div
                    className={styles.displayProfile}
                >
                    <img
                        src={displayImage}
                        alt="display"
                    />
                    {/* FIxME: Add Display name after server side ready */}
                    <div className={styles.displayContent}>
                        <h1>Display Name</h1>
                        <p> HR</p>
                    </div>
                </div>
                <Container
                    className={styles.formContent}
                >
                    <form
                        className={styles.form}
                        onSubmit={handleFormSubmit}
                    >
                        <TextInput
                            className={styles.fullSizeInput}
                            label="Email"
                            name="email"
                            autoFocus
                            onChange={setFieldValue}
                            value={value?.email}
                            error={error?.email}
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
                                disabled={false}
                                type="button"
                                variant="primary"
                                name="save"
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
