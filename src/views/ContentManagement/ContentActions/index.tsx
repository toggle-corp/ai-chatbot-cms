import { useCallback } from 'react';
import {
    IoPencil,
    IoRefreshSharp,
    IoTrash,
} from 'react-icons/io5';
import {
    gql,
    useMutation,
} from '@apollo/client';
import { Button } from '@togglecorp/toggle-ui';

import {
    ArchiveContentInput,
    ArchiveContentMutation,
    ArchiveContentMutationVariables,
    RetriggerContentInput,
    RetriggerContentMutation,
    RetriggerContentMutationVariables,
} from '#generated/types/graphql';
import useAlert from '#hooks/useAlert';
import useBooleanState from '#hooks/useBooleanState';

import EditContentModal from '../EditContent';

import styles from './styles.module.css';

interface Props {
    id: number;
}

const ARCHIVE_CONTENT = gql`
  mutation ArchiveContent($input: ArchiveContentInput!) {
    private {
        archiveContent(data: $input) {
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
const RETRIGGER_CONTENT = gql`
  mutation RetriggerContent($input: RetriggerContentInput!) {
    private {
        retriggerContent(data: $input) {
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

function ContentActions(props: Props) {
    const { id } = props;
    const alert = useAlert();
    const [showEditContentModal, {
        setTrue: setShowEditContentModalTrue,
        setFalse: setShowEditContentModalFalse,
    }] = useBooleanState(false);

    const [
        triggerArchiveContent,
    ] = useMutation<ArchiveContentMutation, ArchiveContentMutationVariables>(
        ARCHIVE_CONTENT,
        {
            onCompleted: (response) => {
                const { ok, errors } = response.private.archiveContent;
                if (errors) {
                    alert.show(
                        'Failed to Archive the Content',
                        { variant: 'danger' },
                    );
                } else if (ok) {
                    alert.show(
                        'Successfully Archived the Content',
                        { variant: 'success' },
                    );
                }
            },
            onError: () => {
                alert.show(
                    'Failed to Archive the Content',
                    { variant: 'danger' },
                );
            },
        },
    );
    const [
        retriggerContent,
    ] = useMutation<RetriggerContentMutation, RetriggerContentMutationVariables >(
        RETRIGGER_CONTENT,
        {
            onCompleted: (response) => {
                const { ok, errors } = response.private.retriggerContent;
                if (errors) {
                    alert.show(
                        'Failed to Retrigger the Content',
                        { variant: 'danger' },
                    );
                } else if (ok) {
                    alert.show(
                        'Successfully Retriggered the Content',
                        { variant: 'success' },
                    );
                }
            },
            onError: () => {
                alert.show(
                    'Failed to Retrigger the Content',
                    { variant: 'danger' },
                );
            },
        },
    );
    const handleArchiveContent = useCallback(() => {
        triggerArchiveContent({
            variables: {
                input: {
                    content: id,
                } as unknown as ArchiveContentInput,
            },
        });
    }, [triggerArchiveContent, id]);
    const handleRetriggerContent = useCallback(() => {
        retriggerContent({
            variables: {
                input: {
                    content: id,
                } as unknown as RetriggerContentInput,
            },
        });
    }, [retriggerContent, id]);

    return (
        <div className={styles.contentActions}>
            <Button
                name={undefined}
                onClick={setShowEditContentModalTrue}
                title="Edit"
                transparent
            >
                <IoPencil />
            </Button>
            <Button
                name={undefined}
                onClick={handleArchiveContent}
                title="Archive"
                transparent
            >
                <IoTrash />
            </Button>
            <Button
                name={undefined}
                onClick={handleRetriggerContent}
                title="Retrigger"
                transparent
            >
                <IoRefreshSharp />
            </Button>
            {showEditContentModal && (
                <EditContentModal
                    onClose={setShowEditContentModalFalse}
                    id={id}
                />
            )}
        </div>
    );
}

export default ContentActions;
