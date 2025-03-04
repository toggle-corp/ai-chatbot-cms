import {
    useCallback,
    useMemo,
    useState,
} from 'react';
import {
    IoAddCircleSharp,
    IoSearchOutline,
} from 'react-icons/io5';
import {
    gql,
    useQuery,
} from '@apollo/client';
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
import {
    UserType,
    UserTypeCountList,
} from '#generated/types/graphql';

import AddUserModal from './AddUserModal';
import UserActions from './UserActions';

import styles from './styles.module.css';

type UserListTable = NonNullable<NonNullable<NonNullable<UserType>>>;

const PAGE_SIZE = 5;

const USER_QUERY = gql`
    query UserList(
        $input: OffsetPaginationInput
    ) {
        private {
            users(pagination: $input) {
                count
                items {
                    email
                    firstName
                    lastName
                    id
                }
            }
        }
    }
`;

const userKeySelector = (option:UserListTable) => option.id;
const statusKeySelector = (option: { key: string }) => option.key;
const statusLabelSelector = (option: { key: string }) => option.key;

/** @knipignore */
// eslint-disable-next-line import/prefer-default-export
export function Component() {
    const [page, setPage] = useState<number>(1);
    const [
        showAddModal,
        setShowAddModal,
    ] = useState(false);
    const {
        data: userResult,
    } = useQuery<UserTypeCountList>(
        USER_QUERY,
        {
            variables: {
                input: {
                    limit: PAGE_SIZE,
                    offset: page,
                },
            },
        },
    );
    const handleAddUserFormModalClose = useCallback(
        () => {
            setShowAddModal(false);
        },
        [],
    );

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
                        placeholder="Enter Name"
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
                        {userResult?.count}
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
                    infoHidden
                    itemsPerPageControlHidden
                    activePage={page}
                    itemsCount={userResult?.count ?? 0}
                    maxItemsPerPage={PAGE_SIZE}
                    onActivePageChange={setPage}
                />
            )}
        >
            <Table
                columns={columns}
                className={styles.table}
                headerCellClassName={styles.headerCell}
                headerRowClassName={styles.headerRow}
                data={userResult?.items}
                keySelector={userKeySelector}
            />
            {showAddModal && (
                <AddUserModal
                    onClose={handleAddUserFormModalClose}
                />
            )}
        </Container>
    );
}

Component.displayName = 'UserManagement';
