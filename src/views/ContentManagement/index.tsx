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
    createStringColumn,
    Pager,
    Table,
} from '@togglecorp/toggle-ui';

import Container from '#components/Container';
import {
    ContentListQuery,
    ContentListQueryVariables,
} from '#generated/types/graphql';

import styles from './styles.module.css';

type ContentListTable = NonNullable<NonNullable<NonNullable<ContentListQuery['private']>['contents']>['items']>[number];

const contentKeySelector = (option: ContentListTable) => option.id;

const PAGE_SIZE = 5;

const CREATE_CONTENT_QUERY = gql`
    query ContentList(
        $input: OffsetPaginationInput
    ) {
        private {
            contents(pagination: $input) {
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

/** @knipignore */
// eslint-disable-next-line import/prefer-default-export
export function Component() {
    const [page, setPage] = useState<number>(1);
    const {
        data: contentResult,
    } = useQuery<ContentListQuery, ContentListQueryVariables>(
        CREATE_CONTENT_QUERY,
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
        // FIXME: Add CreateDAte after added in server side
        createStringColumn<ContentListTable, string>(
            'documentTypeDisplay',
            'File Type',
            (item) => item.documentType,
        ),
        createStringColumn<ContentListTable, string>(
            'tag',
            'Tag',
            (item) => item.tag.map((tag: { name: string; }) => tag.name).join(','),
        ),
        createStringColumn<ContentListTable, string>(
            'documentStatusDisplay',
            'Status',
            (item) => item.documentStatus,
        ),
    ]), []);

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
                    itemsCount={contentResult?.private.contents.count ?? 0}
                    maxItemsPerPage={PAGE_SIZE}
                    onActivePageChange={setPage}
                />
            )}
        >
            <Table
                className={styles.table}
                headerCellClassName={styles.headerCell}
                headerRowClassName={styles.headerRow}
                data={contentResult?.private.contents.items}
                columns={columns}
                keySelector={contentKeySelector}
            />
        </Container>
    );
}

Component.displayName = 'ContentManagement';
