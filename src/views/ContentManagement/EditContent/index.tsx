import { useCallback } from 'react';
import {
    gql,
    useMutation,
} from '@apollo/client';
import {
    createSubmitHandler,
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
    UpdateContentTitleInput,
    UpdateContentTitleMutation,
    UpdateContentTitleMutationVariables,
} from '#generated/types/graphql';
import useAlert from '#hooks/useAlert';
import { transformToFormError } from '#utils/errorTransform';

import styles from './styles.module.css';

const UPDATE_CONTENT = gql`
  mutation UpdateContentTitle($input: UpdateContentTitleInput!) {
    private {
        updateContentTitle(data: $input) {
            ok
            errors
            result {
                createdAt
                documentStatus
                documentType
                id
                tag {
                name
                }
                title
            }
        }
    }
  }
`;

type PartialFormType = Partial<UpdateContentTitleInput>;

type FormSchema = ObjectSchema<PartialFormType>;
type FormSchemaFields = ReturnType<FormSchema['fields']>;

const EditUserFormSchema: FormSchema = {
    fields: (): FormSchemaFields => ({
        title: {
            required: true,
            requiredValidation: requiredStringCondition,
        },
    }),
};
const defaultFormValues: PartialFormType = {};

interface Props {
    onClose: () => void;
    id: number;
}

function EditContentModal(props: Props) {
    const alert = useAlert();
    const {
        onClose,
        id,
    } = props;

    const {
        value,
        error: formError,
        pristine,
        setFieldValue,
        setError,
        validate,
    } = useForm(EditUserFormSchema, { value: defaultFormValues });

    const [
        updateContentTrigger,
        { loading },
    ] = useMutation<UpdateContentTitleMutation, UpdateContentTitleMutationVariables>(
        UPDATE_CONTENT,
        {
            onCompleted: (response) => {
                const { private: privateRes } = response;
                if (!privateRes) return;
                const { updateContentTitle: updateContentRes } = privateRes;
                if (!updateContentRes) return;
                const { errors, ok } = updateContentRes;

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
                    alert.show(
                        'Updated Successfully',
                        { variant: 'success' },
                    );
                }
            },
            onError: (error) => {
                setError({ [nonFieldError]: error.message });
                alert.show(
                    'Failed to Update',
                    { variant: 'danger' },
                );
            },
        },
    );

    const handleUpdateContentSubmit = useCallback((finalValue: PartialFormType) => {
        updateContentTrigger({
            variables: {
                input: {
                    ...finalValue,
                    content: id,
                } as unknown as UpdateContentTitleInput,
            },
        });
    }, [updateContentTrigger, id]);

    const handleSubmit = useCallback(() => {
        createSubmitHandler(validate, setError, handleUpdateContentSubmit)();
    }, [handleUpdateContentSubmit, setError, validate]);

    const error = getErrorObject(formError);

    return (
        <Modal
            heading="Edit Content"
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
                label="Title*"
                name="title"
                value={value.title}
                error={error?.title}
                onChange={setFieldValue}
            />
        </Modal>
    );
}

export default EditContentModal;
