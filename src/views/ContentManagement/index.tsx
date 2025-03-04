import {
    useMemo,
    useState,
} from 'react';
import {
    Button,
    createDateColumn,
    createStringColumn,
    Pager,
    Table,
} from '@togglecorp/toggle-ui';

import Container from '#components/Container';

import styles from './styles.module.css';

type ContentListTable = {
    id: string;
    title: string;
    createdAt: string;
    documentTypeDisplay: string;
    documentStatusDisplay: string;
    tag: { name: string; id: string }[];
};

const contentKeySelector = (option: ContentListTable) => option.id;

const PAGE_SIZE = 5;

const contentData: ContentListTable[] = [];

/** @knipignore */
// eslint-disable-next-line import/prefer-default-export
export function Component() {
    const [page, setPage] = useState<number>(1);

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
                    itemsCount={contentData.length}
                    maxItemsPerPage={PAGE_SIZE}
                    onActivePageChange={setPage}
                />
            )}
        >
            <Table
                className={styles.table}
                headerCellClassName={styles.headerCell}
                headerRowClassName={styles.headerRow}
                columns={columns}
                data={contentData}
                keySelector={contentKeySelector}
            />
        </Container>
    );
}

Component.displayName = 'ContentManagement';
