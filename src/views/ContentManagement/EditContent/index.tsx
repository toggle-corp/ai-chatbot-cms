import { useCallback } from 'react';
import {
    gql,
    useMutation,
} from '@apollo/client';
import {
    createSubmitHandler,
    getErrorObject,
    ObjectSchema,
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

import styles from './styles.module.css';

const UPDATE_CONTENT = gql`
  mutation UpdateContentTitle($input: UpdateContentTitleInput!) {
    private {
        updateContentTitle(data: $input) {
            ok
            errors
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
    contentId: number;
}

function EditContentModal(props: Props) {
    const alert = useAlert();
    const {
        onClose,
        contentId,
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
            onCompleted: (projectResponse) => {
                const response = projectResponse?.private?.updateContentTitle;
                if (!response) {
                    return;
                }
                if (response.ok) {
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

    const handleUpdateContentSubmit = useCallback((finalValue: PartialFormType) => {
        updateContentTrigger({
            variables: {
                input: {
                    ...finalValue,
                    content: contentId,
                } as unknown as UpdateContentTitleInput,
            },
        });
    }, [updateContentTrigger, contentId]);

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
