import {
    useCallback,
    useMemo,
    useState,
} from 'react';
import {
    gql,
    useMutation,
} from '@apollo/client';
import {
    isDefined,
    isNotDefined,
} from '@togglecorp/fujs';
import {
    createSubmitHandler,
    getErrorObject,
    nonFieldError,
    removeNull,
    useForm,
    useFormArray,
} from '@togglecorp/toggle-form';
import {
    Button,
    Modal,
    RawButton,
} from '@togglecorp/toggle-ui';

import Container from '#components/Container';
import UploadFiles, { type FileLike } from '#components/domain/UploadFiles';
import Heading from '#components/Heading';
import {
    ContentCreateInput,
    CreateContentMutation,
    CreateContentMutationVariables,
} from '#generated/types/graphql';
import useAlert from '#hooks/useAlert';
import { transformToFormError } from '#utils/errorTransform';

import FormPreviewSection from './FormPreviewSection';
import createContentFormSchema, {
    defaultFormValues,
    type PartialContentType,
    type PartialFormType,
} from './schema';

import styles from './styles.module.css';

type Status = 'pending' | 'success' | 'failure';

interface FilesStatusKeyValue {
    [clientId: string]: Status
}

const CREATE_CONTENT = gql`
    mutation CreateContent($input: ContentCreateInput!) {
        private {
            createContent(data: $input) {
                ok
                errors
                result {
                    id
                    documentType
                    documentStatus
                    title
                    tag {
                        id
                        name
                    }
                }
            }
        }
    }
`;

interface Props {
    onClose: () => void;
}

function AddContentModal(props: Props) {
    const {
        onClose,
    } = props;

    const [fileSelectedName, setFileSelectedName] = useState<string>();
    const [filesStatusKeyValue, setFilesStatusKeyValue] = useState<FilesStatusKeyValue>();
    const [submissionFileClientId, setSubmissionFileClientId] = useState<string>();
    const alert = useAlert();

    const {
        pristine,
        value,
        error: formError,
        setFieldValue,
        validate,
        setError,
    } = useForm(
        createContentFormSchema,
        { value: defaultFormValues },
    );

    const handleAddFiles = useCallback((values: FileLike[]) => {
        const clientId = values[0].key;

        const newFile: PartialContentType = {
            clientId,
            documentFile: values[0].file,
        };
        setFilesStatusKeyValue((oldVal) => ({
            ...oldVal,
            [clientId]: 'pending',
        }));

        setFieldValue(
            (oldValue: PartialContentType[] | undefined) => (
                [...(oldValue ?? []), newFile]
            ),
            'contents',
        );
    }, [setFieldValue]);

    const error = getErrorObject(formError);

    const {
        setValue: onContentFormChange,
    } = useFormArray<'contents', PartialContentType>(
        'contents',
        setFieldValue,
    );

    const [
        createContent,
        { loading },
    ] = useMutation<CreateContentMutation, CreateContentMutationVariables>(
        CREATE_CONTENT,
        {
            onCompleted: (response) => {
                const { private: privateRes } = response;
                if (!privateRes) return;
                const { createContent: createContentRes } = privateRes;
                if (!createContentRes) return;
                const { errors, ok } = createContentRes;

                if (errors) {
                    const formErrors = transformToFormError(removeNull(errors));
                    setError(formErrors);
                    const errorMessages = errors
                        ?.map((message: { messages: string; }) => message.messages)
                        .filter((msg: string) => msg)
                        .join(', ');
                    alert.show(errorMessages);
                } else if (ok) {
                    if (isDefined(submissionFileClientId)) {
                        setFilesStatusKeyValue((oldVal) => ({
                            ...oldVal,
                            [submissionFileClientId]: 'success',
                        }));
                    }
                    const valueIndexOf = value.contents?.findIndex(
                        (content) => content.clientId === submissionFileClientId,
                    );

                    if (
                        isNotDefined(value)
                            || isNotDefined(value.contents)
                            || isNotDefined(valueIndexOf)
                    ) {
                        return;
                    }

                    const {
                        clientId,
                        ...inputWithoutClientId
                    } = value.contents[valueIndexOf + 1];

                    setSubmissionFileClientId(clientId);

                    const variables: CreateContentMutationVariables = {
                        input: {
                            ...inputWithoutClientId,
                        } as ContentCreateInput,
                    };
                    createContent({
                        variables,
                        context: {
                            hasUpload: true,
                        },
                    });
                    alert.show(
                        'Content addition successfully',
                        { variant: 'success' },
                    );
                }
            },
            onError: (emailError) => {
                setError({ [nonFieldError]: emailError.message });
                if (isDefined(submissionFileClientId)) {
                    setFilesStatusKeyValue((oldVal) => ({
                        ...oldVal,
                        [submissionFileClientId]: 'failure',
                    }));
                }
                alert.show(
                    'Content addition failed',
                    { variant: 'danger' },
                );
            },
        },
    );

    const handleFileClick = useCallback((name: string) => {
        setFileSelectedName(name);
    }, []);

    const formContent = useMemo(() => {
        if (isNotDefined(value.contents)) {
            return undefined;
        }

        const indexValue = value.contents?.findIndex(((ctn) => ctn.clientId === fileSelectedName));

        const valueContent = value.contents[indexValue ?? 0];

        return {
            formValue: valueContent,
            mainIndex: indexValue ?? 0,
            name: valueContent?.documentFile?.name,
        };
    }, [fileSelectedName, value.contents]);

    const handleCreateContentSubmit = useCallback((finalValue: PartialFormType) => {
        if (isNotDefined(finalValue) || isNotDefined(finalValue.contents)) {
            return;
        }
        const { clientId, ...inputWithoutClientId } = finalValue.contents[0];

        setSubmissionFileClientId(clientId);

        const variables: CreateContentMutationVariables = {
            input: {
                ...inputWithoutClientId,
            } as ContentCreateInput,
        };
        createContent({
            variables,
            context: {
                hasUpload: true,
            },
        });
    }, [createContent]);

    const handleSubmit = useCallback(() => {
        createSubmitHandler(validate, setError, handleCreateContentSubmit)();
    }, [handleCreateContentSubmit, validate, setError]);

    return (
        <Modal
            onClose={onClose}
            size="cover"
            freeHeight
            heading="Upload Content"
            bodyClassName={styles.bodyModal}
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
            <Container childrenContainerClassName={styles.uploadSection}>
                <UploadFiles
                    onAdd={handleAddFiles}
                    accept="text/plain"
                />
                <div className={styles.uploadsContainer}>
                    <Heading
                        level={6}
                    >
                        Uploads
                    </Heading>
                    <div className={styles.fileCardContainer}>
                        {(isNotDefined(value.contents) || value.contents.length <= 0) ? (
                            <div>No uploads</div>
                        )
                            : value.contents.map((file) => (
                                <RawButton
                                    type="button"
                                    name={file.clientId}
                                    onClick={handleFileClick}
                                    key={file.clientId}
                                    className={styles.fileCard}
                                >
                                    {file.documentFile.name}
                                    {filesStatusKeyValue?.[file.clientId]}
                                </RawButton>
                            ))}
                    </div>
                </div>
            </Container>
            {isNotDefined(formContent?.formValue)
                ? <div>Please select the file</div>
                : (
                    <FormPreviewSection
                        value={formContent.formValue}
                        index={formContent.mainIndex}
                        onChange={onContentFormChange}
                        error={getErrorObject(error?.contents)}
                    />
                )}
        </Modal>
    );
}

export default AddContentModal;
