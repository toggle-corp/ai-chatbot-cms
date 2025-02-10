import {
    useMemo,
    useState,
} from 'react';
import {
    IoAddCircleOutline,
    IoSearchOutline,
} from 'react-icons/io5';
import {
    Button,
    Checkbox,
    createStringColumn,
    Pager,
    SelectInput,
    Table,
    TextInput,
} from '@togglecorp/toggle-ui';

import Container from '#components/Container';

import UserActions from './UserActions';

import styles from './styles.module.css';

const userKeySelector = (option: UserListTable) => option.id;

const PAGE_SIZE = 5;

type UserListTable = {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
}

const usersData: UserListTable[] = [
    {
        id: '1',
        email: 'subrina.sharma@gmail.com',
        firstName: 'Subina',
        lastName: 'Sharma',
    },
    {
        id: '2',
        email: 'userishere@gmail.com',
        firstName: 'User',
        lastName: 'Ishere',
    },
    {
        id: '3',
        email: 'Sadikshya@togglecorp.com',
        firstName: 'Sadikshya',
        lastName: 'Hamal',
    },
    {
        id: '4',
        email: 'smriti123@gmail.com',
        firstName: 'Smriti',
        lastName: 'Kafle',
    },
    {
        id: '5',
        email: 'babin.karmacharya@togglecorp.com',
        firstName: 'Babin',
        lastName: 'Karmacharya',
    },
    {
        id: '6',
        email: 'aditya@togglecorp.com',
        firstName: 'Aditya',
        lastName: 'Khatri',
    },
];

const statusKeySelector = (option: { key: string }) => option.key;
const statusLabelSelector = (option: { key: string }) => option.key;

/** @knipignore */
// eslint-disable-next-line import/prefer-default-export
export function Component() {
    const [page, setPage] = useState<number>(1);

    const columns = useMemo(() => ([
        // FIXME : Add Element Column
        createStringColumn<UserListTable, string>(
            'checkbox',
            '',
            () => (
                <Checkbox
                    value={undefined}
                    onChange={() => {}}
                    name=""
                />
            ),
        ),
        createStringColumn<UserListTable, string>(
            'sn',
            'S.N',
            (item: UserListTable) => String(item.id),
        ),
        createStringColumn<UserListTable, string>(
            'email',
            'Email',
            (item) => item.email,
            { columnClassName: styles.email },
        ),
        createStringColumn<UserListTable, string>(
            'firstName',
            'First Name',
            (item) => item.firstName,
            { columnClassName: styles.email },
        ),
        createStringColumn<UserListTable, string>(
            'lastName',
            'Last Name',
            (item) => item.lastName,
            { columnClassName: styles.email },
        ),
        // FIXME : Add Element Column
        createStringColumn<UserListTable, string>(
            'actions',
            'Actions',
            UserActions,
            { columnClassName: styles.email },
        ),
    ]), []);

    return (
        <Container
            className={styles.container}
            showHeader
            actionsContainerClassName={styles.actions}
            actions={(
                <div className={styles.actions}>
                    <TextInput
                        className={styles.search}
                        placeholder="Enter First Name Last Name"
                        onChange={() => {}}
                        value={undefined}
                        name="search"
                        icons={<IoSearchOutline />}
                    />
                    <SelectInput
                        placeholder="Active Status"
                        name="status"
                        options={[]}
                        keySelector={statusKeySelector}
                        labelSelector={statusLabelSelector}
                        value={undefined}
                        onChange={() => {}}
                    />
                    <div>154 Users</div>
                    <Button
                        name="Add Content"
                        variant="primary"
                        onClick={() => { }}
                        icons={<IoAddCircleOutline />}
                    >
                        Add user
                    </Button>
                </div>
            )}
            footerActions={(
                <Pager
                    infoHidden
                    itemsPerPageControlHidden
                    activePage={page}
                    itemsCount={usersData.length}
                    maxItemsPerPage={PAGE_SIZE}
                    onActivePageChange={setPage}
                />
            )}
        >
            <Table
                className={styles.table}
                headerCellClassName={styles.headerCell}
                headerRowClassName={styles.headerRow}
                data={usersData}
                columns={columns}
                keySelector={userKeySelector}
            />
        </Container>
    );
}

Component.displayName = 'UserTable';
