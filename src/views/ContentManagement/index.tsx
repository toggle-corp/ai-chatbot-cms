import {
    useMemo,
    useState,
} from 'react';
import {
    gql,
    useQuery,
} from '@apollo/client';
import {
    Button,
    createDateColumn,
    createStringColumn,
    Pager,
    Table,
} from '@togglecorp/toggle-ui';

import Container from '#components/Container';
import {
    ContentListQuery,
    ContentListQueryVariables,
} from '#generated/types/graphql';
import useBooleanState from '#hooks/useBooleanState';

import AddContentModal from './AddContentModal';

import styles from './styles.module.css';

type ContentListTable = NonNullable<NonNullable<NonNullable<ContentListQuery['private']>['content']>['items']>[number];

const contentKeySelector = (option: ContentListTable) => option.id;

const PAGE_SIZE = 5;

const CONTENT_QUERY = gql`
    query ContentList(
        $input: OffsetPaginationInput
    ) {
        private {
            content(pagination: $input) {
                count
                items {
                    id
                    title
                    createdAt
                    modifiedAt
                    documentTypeDisplay
                    documentStatusDisplay
                    tag {
                        name
                        id
                    }
                }
            }
        }
    }
`;

/** @knipignore */
// eslint-disable-next-line import/prefer-default-export
export function Component() {
    const [page, setPage] = useState<number>(1);

    const [
        showAddModal,
        {
            setTrue: setShowAddModalTrue,
            setFalse: setShowAddModalFalse,
        },
    ] = useBooleanState(false);

    const {
        data: contentResult,
    } = useQuery<ContentListQuery, ContentListQueryVariables>(
        CONTENT_QUERY,
        {
            variables: {
                input: {
                    limit: PAGE_SIZE,
                    offset: page,
                },
            },
        },
    );

    const columns = useMemo(() => ([
        createStringColumn<ContentListTable, string>(
            'title',
            'Title',
            (item) => item.title,
        ),
        createDateColumn<ContentListTable, string>(
            'createdAt',
            'Created Date',
            (item) => item.createdAt,
        ),
        createStringColumn<ContentListTable, string>(
            'documentTypeDisplay',
            'File Type',
            (item) => item.documentTypeDisplay,
        ),
        createStringColumn<ContentListTable, string>(
            'tag',
            'Tag',
            (item) => item.tag.map((tag) => tag.name).join(','),
        ),
        createStringColumn<ContentListTable, string>(
            'documentStatusDisplay',
            'Status',
            (item) => item.documentStatusDisplay,
        ),
    ]), []);

    return (
        <>
            <Container
                className={styles.container}
                showHeader
                heading="Content"
                actions={(
                    <Button
                        name="Add Content"
                        variant="primary"
                        onClick={setShowAddModalTrue}
                    >
                        Add
                    </Button>
                )}
                footerActions={(
                    <Pager
                        infoHidden
                        itemsPerPageControlHidden
                        activePage={page}
                        itemsCount={contentResult?.private.content.count ?? 0}
                        maxItemsPerPage={PAGE_SIZE}
                        onActivePageChange={setPage}
                    />
                )}
            >
                <Table
                    className={styles.table}
                    headerCellClassName={styles.headerCell}
                    headerRowClassName={styles.headerRow}
                    cellClassName={styles.tableCell}
                    data={contentResult?.private.content.items}
                    columns={columns}
                    keySelector={contentKeySelector}
                />
            </Container>
            {showAddModal && (
                <AddContentModal
                    onClose={setShowAddModalFalse}
                />
            )}
        </>
    );
}

Component.displayName = 'ContentManagement';
