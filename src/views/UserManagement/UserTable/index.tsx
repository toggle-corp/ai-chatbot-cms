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
    Checkbox,
    createStringColumn,
    Pager,
    SelectInput,
    Table,
    TextInput,
} from '@togglecorp/toggle-ui';

import Container from '#components/Container';

import UserActions from './UserActions';
import UserModal from './UserModal';

import styles from './styles.module.css';

const PAGE_SIZE = 5;

type UserListTable = {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    department?: string;
}

const initialUsersData: UserListTable[] = [
    {
        id: '1',
        email: 'subrina.sharma@gmail.com',
        firstName: 'Subina',
        lastName: 'Sharma',
        department: 'HR',
    },
    {
        id: '2',
        email: 'userishere@gmail.com',
        firstName: 'User',
        lastName: 'Ishere',
        department: 'Engineering',
    },
    {
        id: '3',
        email: 'Sadikshya@togglecorp.com',
        firstName: 'Sadikshya',
        lastName: 'Hamal',
        department: 'Marketing',
    },
    {
        id: '4',
        email: 'smriti123@gmail.com',
        firstName: 'Smriti',
        lastName: 'Kafle',
        department: 'HR',
    },
    {
        id: '5',
        email: 'babin.karmacharya@togglecorp.com',
        firstName: 'Babin',
        lastName: 'Karmacharya',
        department: 'Engineering',
    },
    {
        id: '6',
        email: 'aditya@togglecorp.com',
        firstName: 'Aditya',
        lastName: 'Khatri',
        department: 'Marketing',
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
    const [editingUser, setEditingUser] = useState<UserListTable | undefined>(undefined);

    const handleAddUserFormModalClose = useCallback(
        () => {
            setShowAddModal(false);
            setEditingUser(undefined);
        },
        [],
    );

    const handleAddUser = useCallback((user: PartialForm<UserListTable>) => {
        setUsers((prevUsers) => [
            ...prevUsers,
            { ...user, id: String(prevUsers.length + 1) } as UserListTable,
        ]);
    }, []);

    const handleEditUser = useCallback((user: PartialForm<UserListTable>) => {
        setUsers((prevUsers) => prevUsers.map((u) => (u.id === user.id ? { ...u, ...user } : u)));
    }, []);

    const handleEdit = useCallback((userId: string) => {
        const user = users.find((u) => u.id === userId);
        setEditingUser(user);
        setShowAddModal(true);
    }, [users]);

    const columns = useMemo(() => ([
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
        createStringColumn<UserListTable, string>(
            'actions',
            'Actions',
            ({ id }) => (
                <UserActions
                    userId={id}
                    onEdit={handleEdit}
                    onSubmit={handleEditUser}
                />
            ),
            { columnClassName: styles.email },
        ),
    ]), [handleEdit, handleEditUser]);

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
                    <div>
                        {users.length}
                        Users
                    </div>
                    <Button
                        name="Add Content"
                        variant="primary"
                        onClick={() => setShowAddModal(true)}
                        icons={<IoAddCircleSharp />}
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
                    itemsCount={users.length}
                    maxItemsPerPage={PAGE_SIZE}
                    onActivePageChange={setPage}
                />
            )}
        >
            <Table
                className={styles.table}
                headerCellClassName={styles.headerCell}
                headerRowClassName={styles.headerRow}
                data={users}
                columns={columns}
                keySelector={userKeySelector}
            />
            {showAddModal && (
                <UserModal
                    title={
                        editingUser ? 'Edit User' : 'Add User'
                    }
                    onClose={handleAddUserFormModalClose}
                    onSubmit={
                        editingUser ? handleEditUser : handleAddUser
                    }
                    initialValue={editingUser}
                />
            )}
        </Container>
    );
}

Component.displayName = 'UserTable';
