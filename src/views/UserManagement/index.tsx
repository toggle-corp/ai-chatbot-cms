import {
    useCallback,
    useMemo,
    useState,
} from 'react';
import {
    IoAddCircleSharp,
    IoSearchOutline,
} from 'react-icons/io5';
import { PartialForm } from '@togglecorp/toggle-form';
import {
    Button,
    Chip,
    createStringColumn,
    Pager,
    SelectInput,
    Table,
    TextInput,
} from '@togglecorp/toggle-ui';

import Container from '#components/Container';
import { createElementColumn } from '#components/CreateElementColumn';

import AddUserModal from './AddUserModal';
import UserActions from './UserActions';

import styles from './styles.module.css';

const PAGE_SIZE = 5;

type UserListTable = {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
}
// FIXME :Remove the dummy data after the server side is ready
const initialUsersData: UserListTable[] = [
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

const userKeySelector = (option: UserListTable) => option.id;
const statusKeySelector = (option: { key: string }) => option.key;
const statusLabelSelector = (option: { key: string }) => option.key;

/** @knipignore */
// eslint-disable-next-line import/prefer-default-export
export function Component() {
    const [page, setPage] = useState<number>(1);
    const [users, setUsers] = useState<UserListTable[]>(initialUsersData);
    const [showAddModal, setShowAddModal] = useState(false);
    const handleAddUserFormModalClose = useCallback(
        () => {
            setShowAddModal(false);
        },
        [],
    );

    const handleAddUser = useCallback((user: PartialForm<UserListTable>) => {
        setUsers((prevUsers) => [
            ...prevUsers,
            { ...user, id: String(prevUsers.length + 1) } as UserListTable,
        ]);
    }, []);

    const columns = useMemo(() => ([
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
        createElementColumn<UserListTable, string, { id: string }>(
            'actions',
            'Actions',
            UserActions,
            (_key, datum) => ({ id: datum.id }),
        ),
    ]), []);

    return (
        <Container
            className={styles.container}
            showHeader
            actionsContainerClassName={styles.actions}
            headingDescription={(
                <div className={styles.actions}>
                    <TextInput
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
                </div>
            )}
            actions={(
                <>
                    <Chip>
                        {users.length}
                        Users
                    </Chip>
                    <Button
                        name="Add Content"
                        variant="primary"
                        onClick={() => setShowAddModal(true)}
                        icons={<IoAddCircleSharp />}
                    >
                        Add user
                    </Button>

                </>

            )}
            footerActions={(
                <Pager
                    activePage={page}
                    itemsCount={users.length}
                    maxItemsPerPage={PAGE_SIZE}
                    onActivePageChange={setPage}
                    itemsPerPageControlHidden
                    infoHidden
                />
            )}
        >
            <Table
                columns={columns}
                className={styles.table}
                headerCellClassName={styles.headerCell}
                headerRowClassName={styles.headerRow}
                data={users}
                keySelector={userKeySelector}
            />
            {showAddModal && (
                <AddUserModal
                    title="Add User"
                    onClose={handleAddUserFormModalClose}
                    onSubmit={handleAddUser}
                />
            )}
        </Container>
    );
}

Component.displayName = 'UserManagement';
