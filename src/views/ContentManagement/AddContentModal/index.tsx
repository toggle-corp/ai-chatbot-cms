import {
    useCallback,
    useState,
} from 'react';
import {
    gql,
    useMutation,
} from '@apollo/client';
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

const CREATE_CONTENT = gql`
    mutation CreateContent($input: ContentCreateInput!) {
        private {
            createContent(data: $input) {
                ok
                errors
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

    const [formContent, setFormContent] = useState<PartialContentType>();
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
        const newFile: PartialContentType = {
            clientId: values[0].key,
            documentFile: values[0].file,
            title: '',
        };
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
        removeValue: onContentFormRemove,
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
                    onClose();
                    alert.show(
                        'Content addition successfully',
                        { variant: 'success' },
                    );
                }
            },
            onError: (emailError) => {
                setError({ [nonFieldError]: emailError.message });
                alert.show(
                    'Content addition failed',
                    { variant: 'danger' },
                );
            },
        },
    );

    const handleFileClick = useCallback((name: string) => {
        const content = value.contents?.find((ctn) => ctn.clientId === name);
        setFormContent(content);
    }, [value.contents]);

    const handleCreateContentSubmit = useCallback((finalValue: PartialFormType) => {
        createContent({
            variables: {
                input: finalValue as ContentCreateInput,
            },
        });
    }, [createContent]);

    const handleSubmit = useCallback(() => {
        createSubmitHandler(validate, setError, handleCreateContentSubmit);
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
                />
                <div className={styles.uploadsContainer}>
                    <Heading
                        level={6}
                    >
                        Uploads
                    </Heading>
                    <div className={styles.fileCardContainer}>
                        {value.contents.length <= 0 && (
                            <div>No uploads</div>
                        )}
                        {value.contents.map((file) => (
                            <RawButton
                                type="button"
                                name={file.clientId}
                                onClick={handleFileClick}
                                key={file.clientId}
                                className={styles.fileCard}
                            >
                                {file.documentFile}
                            </RawButton>
                        ))}
                    </div>
                </div>
            </Container>
            <FormPreviewSection
                value={formContent}
                onChange={onContentFormChange}
                error={getErrorObject(error?.contents)}
            />
        </Modal>
    );
}

export default AddContentModal;
