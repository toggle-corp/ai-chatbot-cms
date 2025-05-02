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
import useAlert from '#hooks/useAlert';
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
    addUserRefetch:()=> void; // FIXME: Remove  this after the result added in graphql
}

/** @knipignore */
function AddUserModal(props: Props) {
    const alert = useAlert();
    const {
        onClose,
        addUserRefetch, // FIXME: Remove  this after the result added in graphql
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
                    alert.show(errorMessages);
                } else if (ok) {
                    onClose();
                    addUserRefetch(); // FIXME: Remove  this after the result added in graphql
                    alert.show(
                        'User Activation Link is sent to your email',
                        { variant: 'success' },
                    );
                }
            },
            onError: (emailError) => {
                setError({ [nonFieldError]: emailError.message });
                alert.show(
                    'User addition failed',
                    { variant: 'danger' },
                );
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

    const handleSubmit = useCallback(() => {
        createSubmitHandler(validate, setError, handleAddUserSubmit)();
    }, [validate, setError, handleAddUserSubmit]);

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
