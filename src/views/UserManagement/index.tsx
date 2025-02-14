<<<<<<< HEAD
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

const USERS_QUERY = gql`
    query Users(
        $pagination: OffsetPaginationInput
    ) {
        private {
            users(pagination: $pagination) {
                limit
                offset
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

||||||| parent of 8cc3101 (Add DropdownMenu component)
import { useCallback } from 'react';
import {
    emailCondition,
    getErrorObject,
    ObjectSchema,
    PartialForm,
    requiredStringCondition,
    useForm,
} from '@togglecorp/toggle-form';
import {
    Button,
    TextInput,
} from '@togglecorp/toggle-ui';

import displayImage from '#assets/displayImage.svg';
import Container from '#components/Container';
import Page from '#components/Page';

import styles from './styles.module.css';

type PartialFormType = PartialForm<{
    email: string;
    firstName: string;
    lastName: string;
}>;

type FormSchema = ObjectSchema<PartialFormType>;
type FormSchemaFields = ReturnType<FormSchema['fields']>;

const EditFormSchema: FormSchema = {
    fields: (): FormSchemaFields => ({
        email: {
            required: true,
            requiredValidation: requiredStringCondition,
            validations: [emailCondition],
        },
        firstName: {
            required: true,
            requiredValidation: requiredStringCondition,
        },
        lastName: {
            required: true,
            requiredValidation: requiredStringCondition,
        },
    }),
};

const defaultFormValues: PartialFormType = {};

=======
>>>>>>> 8cc3101 (Add DropdownMenu component)
/** @knipignore */
// eslint-disable-next-line import/prefer-default-export
export function Component() {
<<<<<<< HEAD
    const [page, setPage] = useState<number>(1);
    const [
        showAddModal,
        setShowAddModal,
    ] = useState(false);
    const {
        data: userResult,
    } = useQuery<UserTypeCountList>(
        USERS_QUERY,
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

||||||| parent of 8cc3101 (Add DropdownMenu component)
    const {
        value,
        error: formError,
        setFieldValue,
    } = useForm(EditFormSchema, { value: defaultFormValues });

    const handleFormSubmit = useCallback(() => {}, []);

    const error = getErrorObject(formError);

=======
>>>>>>> 8cc3101 (Add DropdownMenu component)
    return (
<<<<<<< HEAD
        <Container
            className={styles.container}
            showHeader
            actionsContainerClassName={styles.actions}
            headingDescription={(
                // FIXME: Implement OnChange options once server-side filters are added.
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
||||||| parent of 8cc3101 (Add DropdownMenu component)
        <Page
            className={styles.mainContent}
        >
            <Container
                className={styles.editUrl}
            >
                <div
                    className={styles.displayProfile}
                >
                    <div>
                        <img
                            src={displayImage}
                            alt="display"
                        />
                        {/* FIxME: Add Display name after server side ready */}
                        <div className={styles.displayContent}>
                            <h1>Display Name</h1>
                            <p> HR</p>
                        </div>
                    </div>
                </div>

                <Container
                    className={styles.formContent}
                    footerContent={(
                        <div className={styles.actions}>
                            <Button
                                className={styles.loginButton}
                                disabled={false}
                                type="button"
                                variant="default"
                                name="cancel"
                            >
                                Cancel
                            </Button>
                            <Button
                                className={styles.loginButton}
                                disabled={false}
                                type="button"
                                variant="primary"
                                name="save"
                            >
                                Save
                            </Button>
                        </div>
                    )}
                >
                    <form
                        className={styles.form}
                        onSubmit={handleFormSubmit}
                    >
                        <TextInput
                            className={styles.fullSizeInput}
                            label="Email"
                            name="email"
                            autoFocus
                            onChange={setFieldValue}
                            value={value?.email}
                            error={error?.email}
                        />
                        <TextInput
                            name="firstName"
                            label="First Name"
                            value={value?.firstName}
                            error={error?.firstName}
                            onChange={setFieldValue}
                        />
                        <TextInput
                            name="lastName"
                            value={value?.lastName}
                            label="Last Name"
                            error={error?.lastName}
                            onChange={setFieldValue}
                        />

                    </form>
                </Container>
            </Container>
        </Page>
=======
        <div>
            User Management
        </div>
>>>>>>> 8cc3101 (Add DropdownMenu component)
    );
}

Component.displayName = 'UserManagement';
