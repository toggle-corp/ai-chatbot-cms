<<<<<<< Updated upstream
import {
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
    useForm,
} from '@togglecorp/toggle-form';
import {
    Button,
    Modal,
    MultiSelectInput,
    TextInput,
} from '@togglecorp/toggle-ui';

import AppEnumsContext from '#contexts/appEnums';
import {
    CreateContentMutation,
    CreateContentMutationVariables,
} from '#generated/types/graphql';

const CREATE_CONTENT = gql`
    mutation CreateContent($input: ContentCreateInput!) {
        private {
            createContent(data: $input) {
                errors
                ok
                result {
                    id
                    documentStatusDisplay
                    title
                    tag {
                        id
                        name
                    }
                    createdAt
                    documentStatus
                    documentType
                    documentTypeDisplay
                }
            }
        }
    }
`;

type PartialFormType = Partial<CreateContentMutationVariables['input']>
type FormSchema = ObjectSchema<PartialFormType>;
type FormSchemaFields = ReturnType<FormSchema['fields']>;

const CreateContentSchema: FormSchema = ({
    fields: (): FormSchemaFields => ({
        title: {
            required: true,
        },
        tag: {
            required: true,
        },
        documentFile: {
            required: true,
        },
    }),
});

const defaultFormValues: PartialFormType = {};

interface Props {
    onClose: () => void;
}
function AddContentModal(props: Props) {
    const {
        onClose,
    } = props;

    const {
        pristine,
        value,
        error: contentError,
        setFieldValue,
        validate,
        setError,
    } = useForm(CreateContentSchema, { value: defaultFormValues });

    const error = getErrorObject(contentError);

    const [
        createContent,
        { loading },
    ] = useMutation<CreateContentMutation, CreateContentMutationVariables>(
        CREATE_CONTENT,
    );

    const { appEnums } = useContext(AppEnumsContext);

    console.log('enums', appEnums);

    const handleSubmit = useCallback((finalValue: PartialFormType) => {
        createContent({
            variables: {
                input: finalValue as CreateContentMutationVariables['input'],
            },
        });
    }, [createContent]);

    const handleCreateContentSubmission = createSubmitHandler(
        validate,
        setError,
        handleSubmit,
    );

    return (
        <Modal
            heading="Add Content"
            onClose={onClose}
            footer={(
                <>
                    <Button
                        disabled={pristine || loading}
                        name="Cancel"
                    >
                        Cancel
                    </Button>
                    <Button
                        name={undefined}
                        disabled={pristine || loading}
                        variant="primary"
                        onChange={handleCreateContentSubmission}
                    >
                        Save
                    </Button>
                </>
            )}
        >
            <TextInput
                required
                name="title"
                value={value.title}
                error={error?.title}
                onChange={setFieldValue}
                label="Title"
                autoFocus
            />
        </Modal>
    );
}

export default AddContentModal;
||||||| Stash base
=======
import {
    useCallback,
    useContext,
} from 'react';
import {
    gql,
    useMutation,
} from '@apollo/client';
import {
    getErrorObject,
    ObjectSchema,
    useForm,
} from '@togglecorp/toggle-form';
import {
    Button,
    Modal,
    TextInput,
} from '@togglecorp/toggle-ui';

import FileInput from '#components/FileInput';
import AppEnumsContext from '#contexts/appEnums';
import {
    CreateContentMutation,
    CreateContentMutationVariables,
} from '#generated/types/graphql';
import { createSubmitHandler } from '#utils/submissionHelper';

const CREATE_CONTENT = gql`
    mutation CreateContent($input: ContentCreateInput!) {
        private {
            createContent(data: $input) {
                errors
                ok
                result {
                    id
                    documentStatusDisplay
                    title
                    tag {
                        id
                        name
                    }
                    createdAt
                    documentStatus
                    documentType
                    documentTypeDisplay
                }
            }
        }
    }
`;

type PartialFormType = Partial<CreateContentMutationVariables['input']>
type FormSchema = ObjectSchema<PartialFormType>;
type FormSchemaFields = ReturnType<FormSchema['fields']>;

const CreateContentSchema: FormSchema = ({
    fields: (): FormSchemaFields => ({
        title: {
            required: true,
        },
        tag: {
            required: true,
        },
        documentFile: {
            required: true,
        },
    }),
});

const defaultFormValues: PartialFormType = {};

interface Props {
    onClose: () => void;
}
function AddContentModal(props: Props) {
    const {
        onClose,
    } = props;

    const {
        pristine,
        value,
        error: contentError,
        setFieldValue,
        validate,
        setError,
    } = useForm(CreateContentSchema, { value: defaultFormValues });

    const error = getErrorObject(contentError);

    const [
        createContent,
        { loading },
    ] = useMutation<CreateContentMutation, CreateContentMutationVariables>(
        CREATE_CONTENT,
    );

    const { appEnums } = useContext(AppEnumsContext);

    const handleSubmit = useCallback((finalValue: PartialFormType) => {
        createContent({
            variables: {
                input: finalValue as CreateContentMutationVariables['input'],
            },
        });
    }, [createContent]);

    const handleCreateContentSubmission = createSubmitHandler(
        validate,
        setError,
        handleSubmit,
    );

    return (
        <Modal
            heading="Add Content"
            onClose={onClose}
            size="small"
            footer={(
                <>
                    <Button
                        disabled={pristine || loading}
                        name="Cancel"
                    >
                        Cancel
                    </Button>
                    <Button
                        name={undefined}
                        disabled={pristine || loading}
                        variant="primary"
                        onChange={handleCreateContentSubmission}
                    >
                        Save
                    </Button>
                </>
            )}
        >
            <TextInput
                required
                name="title"
                value={value.title}
                error={error?.title}
                onChange={setFieldValue}
                label="Title"
                autoFocus
            />
            <FileInput
                name="documentFile"
                onChange={setFieldValue}
                value={value.documentFile}
            />
        </Modal>
    );
}

export default AddContentModal;
>>>>>>> Stashed changes
