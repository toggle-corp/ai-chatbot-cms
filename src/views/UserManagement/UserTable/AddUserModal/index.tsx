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
    TextInput,
} from '@togglecorp/toggle-ui';

import styles from './styles.module.css';

interface Props {
    onClose: () => void;
}

type PartialFormType = PartialForm<{
    email: string;
}>;

type FormSchema = ObjectSchema<PartialFormType>;
type FormSchemaFields = ReturnType<FormSchema['fields']>;

const AddFormSchema: FormSchema = {
    fields: (): FormSchemaFields => ({
        email: {
            required: true,
            requiredValidation: requiredStringCondition,
            validations: [emailCondition],
        },
    }),
};

const defaultFormValues: PartialFormType = {};

function AddUserFormModal(props: Props) {
    const {
        onClose,
    } = props;
    const {
        value,
        error: formError,
        setFieldValue,
    } = useForm(AddFormSchema, { value: defaultFormValues });

    const handleFormSubmit = useCallback(() => {}, []);

    const error = getErrorObject(formError);
    return (
        <Modal
            heading="Add User"
            onClose={onClose}
            size="small"
            footer={(
                <div className={styles.footerContent}>
                    <Button
                        name="cancel"
                        variant="default"
                    >
                        Cancel
                    </Button>
                    <Button
                        name="cancel"
                        variant="primary"
                    >
                        Send
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
            </form>
        </Modal>
    );
}

export default AddUserFormModal;
