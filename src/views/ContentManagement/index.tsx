import { useMemo } from 'react';
import {
    gql,
    useQuery,
} from '@apollo/client';
import {
    Button,
    Chip,
    createDateColumn,
    createStringColumn,
    Pager,
    Table,
} from '@togglecorp/toggle-ui';

import Container from '#components/Container';
import { createElementColumn } from '#components/CreateElementColumn';
import {
    ContentEnumsQuery,
    ContentEnumsQueryVariables,
    ContentListQuery,
    ContentListQueryVariables,
} from '#generated/types/graphql';
import useFilterState from '#hooks/useFilterState';

import ContentActions from './ContentActions';

import styles from './styles.module.css';

type ContentListTable = NonNullable<NonNullable<NonNullable<ContentListQuery['private']>['contents']>['items']>[number];

const contentKeySelector = (option: ContentListTable) => option.id;

const PAGE_SIZE = 2;

const CREATE_CONTENT_QUERY = gql`
    query ContentList(
        $pagination: OffsetPaginationInput,
    ) {
        private {
            contents(pagination: $pagination) {
                count
                items {
                    createdAt
                    id
                    title
                    documentType
                    documentStatus
                    tag {
                        name
                    }
                }
            }
        }
    }
`;

const CONTENT_ENUMS = gql`
    query ContentEnums {
        enums {
            ContentDocumentStatus {
                key
                label
            }
            ContentDocumentType {
                key
                label
            }
        }
    }
`;

const statusVariant: Record<string, string> = {
    Pending: 'default',
    'Text extracted': 'default',
    'Added to vector': 'success',
    'Deleted from vector': 'warning',
    Failure: 'danger',
};
/** @knipignore */
// eslint-disable-next-line import/prefer-default-export
export function Component() {
    const {
        page,
        setPage,
    } = useFilterState<{
        createdAtGte?: string;
        createdAtLte?: string;
        documentType?: string;
        documentStatus?: string ;
    }>({
        pageSize: PAGE_SIZE,
        filter: {},
    });

    const {
        data: contentResult,
    } = useQuery<ContentListQuery, ContentListQueryVariables>(
        CREATE_CONTENT_QUERY,
    );

    const {
        data: contentEnumsResponse,
    } = useQuery<ContentEnumsQuery, ContentEnumsQueryVariables>(
        CONTENT_ENUMS,
    );

    const documentType = contentEnumsResponse?.enums.ContentDocumentType;

    const documentStatus = contentEnumsResponse?.enums.ContentDocumentStatus;

    const columns = useMemo(() => ([
        createStringColumn<ContentListTable, string>(
            'title',
            'Title',
            (item) => item.title,
            { columnClassName: styles.actions },
        ),
        createDateColumn<ContentListTable, string>(
            'createdAt',
            'Created At',
            (item) => item.createdAt,
            { columnClassName: styles.actions },
        ),
        createStringColumn<ContentListTable, string>(
            'documentTypeDisplay',
            'File Type',
            (item) => documentType?.find(
                (type) => type.key === item.documentType,
            )?.label,
        ),
        createStringColumn<ContentListTable, string>(
            'tag',
            'Tag',
            (item) => item.tag.map((tag: { name: string; }) => tag.name).join(','),
            { columnClassName: styles.actions },
        ),
        createElementColumn<ContentListTable, string,
        { status: string | undefined; variant: string }>(
            'documentStatusDisplay',
            'Status',
            ({ status }) => (
                <Chip
                    className={styles.status}
                    label={status}
                />
            ),
            (_key, item) => {
                const statusLabel = documentStatus?.find(
                    (status) => status.key === item.documentStatus,
                )?.label;
                const variant = statusLabel ? statusVariant[statusLabel] : '';
                return {
                    status: statusLabel,
                    variant,
                };
            },
            { columnClassName: styles.actions },
        ),
        createElementColumn<ContentListTable, string, { id: number }>(
            'actions',
            'Actions',
            ContentActions,
            (_key, datum) => ({
                id: Number(datum.id),
            }),
            { columnClassName: styles.actions },
        ),
    ]), [documentType, documentStatus]);

    const data = contentResult?.private.contents;

    return (
        <Container
            className={styles.container}
            showHeader
            heading="Content"
            actions={(
                <Button
                    name="Add Content"
                    variant="primary"
                    onClick={() => {}}
                    disabled
                >
                    Add
                </Button>
            )}
            footerActions={(
                <Pager
                    infoHidden
                    itemsPerPageControlHidden
                    activePage={page}
                    itemsCount={data?.count ?? 0}
                    maxItemsPerPage={PAGE_SIZE}
                    onActivePageChange={setPage}
                />
            )}
        >
            <Table
                className={styles.table}
                headerCellClassName={styles.headerCell}
                headerRowClassName={styles.headerRow}
                data={data?.items}
                columns={columns}
                keySelector={contentKeySelector}
            />
        </Container>
    );
}

Component.displayName = 'ContentManagement';
