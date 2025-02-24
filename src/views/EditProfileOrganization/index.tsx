import {
    useCallback,
    useState,
} from 'react';
import { IoPencil } from 'react-icons/io5';
import {
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

import organizationProfile from '#assets/organizationProfile.svg';
import Container from '#components/Container';
import Page from '#components/Page';

import styles from './styles.module.css';

type PartialFormType = PartialForm<{
    organizationName: string;
}>;

type FormSchema = ObjectSchema<PartialFormType>;
type FormSchemaFields = ReturnType<FormSchema['fields']>;

const EditOrganizationProfileSchema: FormSchema = {
    fields: (): FormSchemaFields => ({
        organizationName: {
            required: true,
            requiredValidation: requiredStringCondition,
        },
    }),
};

const defaultFormValues: PartialFormType = {};

/** @knipignore */
// eslint-disable-next-line import/prefer-default-export
export function Component() {
    const [image] = useState<string>(organizationProfile);
    const {
        value,
        error: formError,
        setFieldValue,
    } = useForm(EditOrganizationProfileSchema, { value: defaultFormValues });

    const handleFormSubmit = useCallback(() => {
        // FIXME: Implement form submission logic here
    }, []);

    const error = getErrorObject(formError);

    return (
        <Page className={styles.mainContent}>
            <Container className={styles.editOrganization}>
                <div className={styles.organizationAction}>
                    <img
                        className={styles.roundImage}
                        src={image}
                        alt="display"
                    />
                    <Button
                        className={styles.editButton}
                        variant="default"
                        name={undefined}
                        icons={<IoPencil />}
                    >
                        Edit
                    </Button>
                </div>
                <form
                    className={styles.form}
                    onSubmit={handleFormSubmit}
                >
                    <TextInput
                        className={styles.fullSizeInput}
                        name="organizationName"
                        label="Organization Name"
                        value={value?.organizationName}
                        error={error?.organizationName}
                        onChange={setFieldValue}
                    />
                    <div className={styles.actions}>
                        <Button
                            type="button"
                            variant="default"
                            name={undefined}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            name={undefined}
                        >
                            Save
                        </Button>
                    </div>
                </form>
            </Container>
        </Page>
    );
}

Component.displayName = 'EditOrganizationProfile';
