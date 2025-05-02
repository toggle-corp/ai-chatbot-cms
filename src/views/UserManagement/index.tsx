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
    createStringColumn,
    Pager,
    SelectInput,
    Table,
    TextInput,
} from '@togglecorp/toggle-ui';

import Chip, { type ChipVariant } from '#components/Chip';
import Container from '#components/Container';
import { createElementColumn } from '#components/CreateElementColumn';
import {
    UsersQuery,
    UsersQueryVariables,
    UserType,
} from '#generated/types/graphql';
import useBooleanState from '#hooks/useBooleanState';
import useFilterState from '#hooks/useFilterState';

import AddUserModal from './AddUserModal';
import UserActions from './UserActions';

import styles from './styles.module.css';

type UserListTable = NonNullable<NonNullable<NonNullable<UserType> & { sn: string }>>;

const PAGE_SIZE = 10;

const USERS_QUERY = gql`
    query Users(
        $pagination: OffsetPaginationInput,
        $filters: UserFilter
    ) {
        private {
            users(
                pagination: $pagination,
                filters: $filters
            ) {
                limit
                offset
                count
                items {
                    email
                    firstName
                    lastName
                    department
                    isActive
                    id
                }
            }
        }
    }
`;
// FIXME: Add enum after server side is fixed
const statusOption = [
    { isActive: true, label: 'Active' },
    { isActive: false, label: 'Inactive' },
];
const userKeySelector = (option: UserListTable) => option.id;

const statusKeySelector = (option: { isActive: boolean }) => String(option.isActive);
const statusLabelSelector = (option: { isActive: boolean }) => String(option.isActive);

const statusVariant: Record<string, string> = {
    active: 'success',
    inActive: 'danger',
};

/** @knipignore */
// eslint-disable-next-line import/prefer-default-export
export function Component() {
    const [page, setPage] = useState<number>(1);
    const [showAddModal, {
        setTrue: setShowAddModalTrue,
        setFalse: setShowAddModalFalse,
    }] = useBooleanState(false);

    const {
        filter,
        setFilterField,
    } = useFilterState<{
        displayName?: string;
        isActive?: boolean;
    }>({
        filter: {},
        pageSize: PAGE_SIZE,
    });

    const variables = {
        pagination: {
            limit: PAGE_SIZE,
            offset: (page - 1) * PAGE_SIZE,
        },
        filters: {
            displayName: filter.displayName ? { contains: filter.displayName } : undefined,
            isActive: filter.isActive !== undefined ? { exact: !!filter.isActive } : undefined,
        },
    };

    const {
        data: userResult,
        refetch: userRefetch, // FIXME: Remove  this after the result added in graphql
    } = useQuery<UsersQuery, UsersQueryVariables>(
        USERS_QUERY,
        {
            variables,
        },
    );

    const onChange = useCallback(
        (newValue: string | undefined) => {
            let isActiveValue;
            if (newValue === 'true') {
                isActiveValue = true;
            } else if (newValue === 'false') {
                isActiveValue = false;
            } else {
                isActiveValue = undefined;
            }

            setFilterField(isActiveValue, 'isActive');
        },
        [setFilterField],
    );

    const Users = useMemo(() => (
        userResult?.private.users.items?.map((user, index) => ({
            ...user,
            sn: (page - 1) * PAGE_SIZE + index + 1,
        })) as unknown as UserListTable[]
    ), [page, userResult]);

    const columns = useMemo(() => ([
        createStringColumn<UserListTable, string>(
            'sn',
            'S.N',
            (item) => String(item.sn),
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
        createElementColumn<UserListTable, string, { activeStatus: string; variant: string }>(
            'isActive',
            'Status',
            ({ activeStatus, variant }) => (
                <Chip
                    label={activeStatus}
                    variant={variant as ChipVariant}
                />
            ),
            (_key, item) => {
                const statusLabel = item.isActive ? 'Active' : 'Inactive';
                const variant = item.isActive ? statusVariant.active : statusVariant.inActive;
                return {
                    activeStatus: statusLabel,
                    variant,
                };
            },
            { columnClassName: styles.status },
        ),
        createElementColumn<UserListTable, string,
        {
            userName: string,
            isActive: boolean,
            userId: string,
            refetch:(
            ) => void,
                }>(
                'actions',
                'Actions',
                UserActions,
                (_key, datum) => (
                    {
                        userName: datum.firstName,
                        isActive: datum.isActive,
                        userId: datum.id,
                        // FIXME: Remove  this after the result added in graphql
                        refetch: userRefetch,
                    }
                ),
                { columnClassName: styles.status },
                ),
    ]), [userRefetch]);

    return (
        <Container
            className={styles.container}
            showHeader
            actionsContainerClassName={styles.actions}
            headingDescription={(
                <div className={styles.actions}>
                    <TextInput
                        placeholder="Enter Name"
                        onChange={setFilterField}
                        value={filter.displayName}
                        name="displayName"
                        icons={<IoSearchOutline />}
                    />
                    <SelectInput
                        placeholder="Active Status"
                        name="isActive"
                        options={statusOption}
                        keySelector={statusKeySelector}
                        labelSelector={statusLabelSelector}
                        value={filter.isActive !== undefined ? String(filter.isActive) : null}
                        onChange={onChange}
                    />
                </div>
            )}
            actions={(
                <>
                    <Chip
                        className={styles.userCount}
                        variant="default"
                        label={`${userResult?.private?.users?.count} users`}
                    />
                    <Button
                        name="Add User"
                        variant="primary"
                        onClick={setShowAddModalTrue}
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
                    itemsCount={userResult?.private?.users?.count ?? 0}
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
                data={Users}
                keySelector={userKeySelector}
            />
            {showAddModal && (
                <AddUserModal
                    onClose={setShowAddModalFalse}
                    // FIXME: Remove  this after the result added in graphql
                    addUserRefetch={userRefetch}
                />
            )}
        </Container>
    );
}

Component.displayName = 'UserManagement';
