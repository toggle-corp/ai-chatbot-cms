import {
    useCallback,
    useState,
} from 'react';
import { IoPencil } from 'react-icons/io5';
import { gql } from '@apollo/client';
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

import Container from '#components/Container';
import Page from '#components/Page';
import { UpdateOrganizationInputType } from '#generated/types/graphql';

import styles from './styles.module.css';

const UPDATE_ORGANIZATION = gql`
    mutation UpdateOrganization($input:UpdateOrganizationInputType!) {
        private {
            updateOrganization(data: $input) {
                errors
                ok
            }
        }
    }
`;

type PartialFormType = PartialForm<UpdateOrganizationInputType>;

type FormSchema = ObjectSchema<PartialFormType>;
type FormSchemaFields = ReturnType<FormSchema['fields']>;

const EditOrganizationProfileSchema: FormSchema = {
    fields: (): FormSchemaFields => ({
        organization: {
            required: true,
            requiredValidation: requiredStringCondition,
        },
        image: {
            required: false,
        },
        navbarColor: {
            required: true,
            requiredValidation: requiredStringCondition,
        },
        sliderBarColor: {
            required: true,
        },
    }),
};

const defaultFormValues: PartialFormType = {};

/** @knipignore */
// eslint-disable-next-line import/prefer-default-export
export function Component() {
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
                        src={value.image}
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
                        name="organization"
                        label="Organization Name"
                        value={value?.organization}
                        error={error?.organization}
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
