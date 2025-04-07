import {
    ObjectSchema,
    PartialForm,
    requiredStringCondition,
    useForm,
} from '@togglecorp/toggle-form';
import {
    Button,
    Modal,
    SelectInput,
} from '@togglecorp/toggle-ui';

import styles from './styles.module.css';

interface Props {
    onClose: () => void;
    initialValue?: PartialFormType;
}
type PartialFormType = PartialForm<{
    userRole: string;
}>;
type FormSchema = ObjectSchema<PartialFormType>;
type FormSchemaFields = ReturnType<FormSchema['fields']>

const keySelector = (option: { key: string }) => option.key;
const labelSelector = (option: { key: string }) => option.key;

const EditUserFormSchema: FormSchema = {
    fields: (): FormSchemaFields => ({
        userRole: {
            required: true,
            requiredValidation: requiredStringCondition,
        },
    }),
};
const defaultFormValues: PartialFormType = {};

function EditUserModal(props: Props) {
    const {
        onClose,
        initialValue = defaultFormValues,
    } = props;
    const {
        pristine,
        setFieldValue,
    } = useForm(EditUserFormSchema, { value: initialValue });
    return (
        <Modal
            heading="Edit Role"
            onClose={onClose}
            size="extraSmall"
            footer={(
                <div className={styles.footerContent}>
                    <Button
                        name="cancel"
                        variant="default"
                        onClick={onClose}
                        disabled={pristine}
                    >
                        Cancel
                    </Button>
                    <Button
                        name="save"
                        disabled={pristine}
                        variant="primary"
                        onClick={() => {}} // FIXME : Add Submission logic here
                    >
                        Save
                    </Button>
                </div>
            )}
        >
            <SelectInput
                label="User Role"
                placeholder="User Role"
                name="userRole"
                options={[]} // FIXME : add options after server side is ready
                keySelector={keySelector}
                labelSelector={labelSelector}
                value={undefined}
                onChange={setFieldValue}
            />
        </Modal>
    );
}
export default EditUserModal;
