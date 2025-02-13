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
    Modal,
    SelectInput,
    TextInput,
} from '@togglecorp/toggle-ui';

import styles from './styles.module.css';

interface Props {
    onClose: () => void;
    title: string;
    initialValue?: PartialFormType;
    onSubmit: (value: PartialFormType) => void;
}

type PartialFormType = PartialForm<{
    id?: string;
    email: string;
    firstName: string;
    lastName: string;
    department: string;
}>;

type FormSchema = ObjectSchema<PartialFormType>;
type FormSchemaFields = ReturnType<FormSchema['fields']>;

const UserFormSchema: FormSchema = {
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
        department: {
            required: true,
            requiredValidation: requiredStringCondition,
        },
    }),
};
// FIXME: Remove the dummy data after server side is ready
const departmentOption = [
    {
        value: 'HR',
        label: 'HR',
    },
    {
        value: 'Operations',
        label: 'Operations',
    },
    {
        value: 'Development',
        label: 'Development',
    },
    {
        value: 'Analysis',
        label: 'Analysis',
    },
];

const defaultFormValues: PartialFormType = {};
const keySelector = (option: { value: string; label: string }) => option.value;
const labelSelector = (option: { value: string; label: string }) => option.label;

function UserModal(props: Props) {
    const {
        onClose,
        title,
        initialValue = defaultFormValues,
        onSubmit,
    } = props;

    const {
        value,
        error: formError,
        setFieldValue,
    } = useForm(UserFormSchema, { value: initialValue });

    const handleFormSubmit = useCallback(() => {
        onSubmit(value);
        onClose();
    }, [onSubmit, value, onClose]);

    const error = getErrorObject(formError);

    return (
        <Modal
            heading={title}
            onClose={onClose}
            footer={(
                <div className={styles.footerContent}>
                    <Button
                        name="cancel"
                        variant="default"
                        onClick={onClose}
                    >
                        Cancel
                    </Button>
                    <Button
                        name="save"
                        variant="primary"
                        onClick={handleFormSubmit}
                    >
                        Save
                    </Button>
                </div>
            )}
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
                <SelectInput
                    className={styles.fullSizeInput}
                    name="department"
                    label="Department"
                    options={departmentOption}
                    keySelector={keySelector}
                    labelSelector={labelSelector}
                    value={value?.department}
                    onChange={setFieldValue}
                />
            </form>
        </Modal>
    );
}

export default UserModal;
