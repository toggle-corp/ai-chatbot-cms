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
    title: string;
    initialValue?: PartialFormType;
    onSubmit: (value: PartialFormType) => void;
}

type PartialFormType = PartialForm<{
    email: string;
}>;

type FormSchema = ObjectSchema<PartialFormType>;
type FormSchemaFields = ReturnType<FormSchema['fields']>;

const AddUserFormSchema: FormSchema = {
    fields: (): FormSchemaFields => ({
        email: {
            required: true,
            requiredValidation: requiredStringCondition,
            validations: [emailCondition],
        },
    }),
};

const defaultFormValues: PartialFormType = {};
/** @knipignore */
function AddUserModal(props: Props) {
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
    } = useForm(AddUserFormSchema, { value: initialValue });

    const handleFormSubmit = useCallback(() => {
        onSubmit(value);
        onClose();
    }, [onSubmit, value, onClose]);

    const error = getErrorObject(formError);

    return (
        <Modal
            heading={title}
            onClose={onClose}
            size="extraSmall"
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
            </form>
        </Modal>
    );
}

export default AddUserModal;
