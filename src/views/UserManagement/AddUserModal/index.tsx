import { useCallback } from 'react';
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
    removeNull,
    requiredStringCondition,
    useForm,
} from '@togglecorp/toggle-form';
import {
    Button,
    Modal,
    TextInput,
} from '@togglecorp/toggle-ui';

import {
    AddUserInput,
    AddUsersMutation,
    AddUsersMutationVariables,
} from '#generated/types/graphql';
import { transformToFormError } from '#utils/errorTransform';

import styles from './styles.module.css';

const ADD_USERS = gql`
    mutation AddUsers($input: AddUserInput!) {
        public {
            addUser(data: $input) {
                errors
                ok
            }
        }
    }
`;
type PartialFormType = Partial<AddUserInput>

type FormSchema = ObjectSchema<PartialFormType>;
type FormSchemaFields = ReturnType<FormSchema['fields']>;

const AddUserFormSchema: FormSchema = {
    fields: (): FormSchemaFields => ({
        emails: {
            required: true,
            requiredValidation: requiredStringCondition,
            validations: [emailCondition],
        },
    }),
};

const defaultFormValues: PartialFormType = {};

interface Props {
    onClose: () => void;
}

/** @knipignore */
function AddUserModal(props: Props) {
    const {
        onClose,
    } = props;

    const {
        pristine,
        value,
        error: formError,
        setFieldValue,
        validate,
        setError,
    } = useForm(AddUserFormSchema, { value: defaultFormValues });

    const error = getErrorObject(formError);
    const [
        addUser,
        { loading },
    ] = useMutation<AddUsersMutation, AddUsersMutationVariables>(
        ADD_USERS,
        {
            onCompleted: (response) => {
                const { public: publicRes } = response;
                if (!publicRes) return;
                const { addUser: addUserRes } = publicRes;
                if (!addUserRes) return;
                const { errors, ok } = addUserRes;

                if (errors) {
                    const formErrors = transformToFormError(removeNull(errors));
                    setError(formErrors);
                    const errorMessages = errors
                        ?.map((message: { messages: string; }) => message.messages)
                        .filter((msg: string) => msg)
                        .join(', ');
                    // eslint-disable-next-line no-alert
                    window.alert(errorMessages); // FIXME: add alert.show ,
                } else if (ok) {
                    onClose();
                    // eslint-disable-next-line no-alert
                    window.alert('User Activation Link is sent to your email'); // FIXME: add alert.show ,
                }
            },
            onError: (emailError) => {
                setError({ [nonFieldError]: emailError.message });
                // eslint-disable-next-line no-alert
                window.alert('User addition failed'); // FIXME: add alert.show ,
            },
        },
    );
    const handleAddUserSubmit = useCallback((finalValue: PartialFormType) => {
        addUser({
            variables: {
                input: finalValue as AddUserInput,
            },
        });
    }, [addUser]);

    const handleSubmit = (_name: 'save', e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        createSubmitHandler(validate, setError, handleAddUserSubmit)();
    };

    return (
        <Modal
            heading="Add User"
            onClose={onClose}
            size="extraSmall"
            footer={(
                <div className={styles.footerContent}>
                    <Button
                        name="cancel"
                        variant="default"
                        onClick={onClose}
                        disabled={pristine || loading}
                    >
                        Cancel
                    </Button>
                    <Button
                        name="save"
                        disabled={pristine || loading}
                        variant="primary"
                        onClick={handleSubmit}
                    >
                        Save
                    </Button>
                </div>
            )}
        >

            <TextInput
                className={styles.fullSizeInput}
                label="Email"
                name="emails"
                autoFocus
                onChange={setFieldValue}
                value={value?.emails}
                error={error?.emails}
            />

        </Modal>
    );
}

export default AddUserModal;
