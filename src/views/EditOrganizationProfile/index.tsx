import {
    useCallback,
    useState,
} from 'react';
import {
    gql,
    useMutation,
} from '@apollo/client';
import {
    createSubmitHandler,
    getErrorObject,
    nonFieldError,
    ObjectSchema,
    PartialForm,
    requiredStringCondition,
    useForm,
} from '@togglecorp/toggle-form';
import {
    Avatar,
    Button,
    TextInput,
} from '@togglecorp/toggle-ui';

import ColorInput from '#components/ColorInput';
import Container from '#components/Container';
import Page from '#components/Page';
import {
    UpdateOrganizationInputType,
    UpdateOrganizationMutation,
    UpdateOrganizationMutationVariables,
} from '#generated/types/graphql';
import useAlert from '#hooks/useAlert';
import { transformToFormError } from '#utils/errorTransform';

import styles from './styles.module.css';

const UPDATE_ORGANIZATION = gql`
    mutation UpdateOrganization($input: UpdateOrganizationInputType!) {
        private {
            updateOrganization(data: $input) {
                errors
                ok
                result{
                    id
                    name
                    navbarColor
                    sliderBarColor
                }
            }
        }
    }
`;

type PartialFormType = PartialForm<UpdateOrganizationInputType> ;

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
    const alert = useAlert();
    const {
        value,
        error: formError,
        setFieldValue,
        validate,
        setError,
    } = useForm(EditOrganizationProfileSchema, { value: defaultFormValues });

    const [
        triggerUpdateOrganization,
    ] = useMutation<UpdateOrganizationMutation, UpdateOrganizationMutationVariables>(
        UPDATE_ORGANIZATION,
        {
            onCompleted: (response) => {
                if (response.private.updateOrganization.ok) {
                    alert.show(
                        'Successfully updated!',
                        { variant: 'success' },
                    );
                } else {
                    setError(transformToFormError(response.private.updateOrganization.errors));
                    const errorMessages = response.private.updateOrganization.errors
                        ?.map((error: { messages: string }) => error.messages)
                        .filter((message: string) => message)
                        .join(', ');
                    alert.show(
                        errorMessages,
                        { variant: 'danger' },
                    );
                }
            },
            onError: (errors) => {
                setError({ [nonFieldError]: errors.message });
                alert.show(
                    'There was an error updating!',
                    { variant: 'danger' },
                );
            },
        },
    );

    const [
        organizationImagePreview,
        setOrganizationImagePreview,
    ] = useState<string | undefined>(undefined);

    const handleUpdateOrganizationSubmit = useCallback((
        finalValue: PartialFormType,
        imageFile?: File,
    ) => {
        const variables: UpdateOrganizationMutationVariables = {
            input: finalValue as UpdateOrganizationInputType,
        };

        if (imageFile) {
            variables.input.image = imageFile;
            setOrganizationImagePreview(URL.createObjectURL(imageFile));
        }

        triggerUpdateOrganization({ variables });
    }, [triggerUpdateOrganization]);

    const handleSubmit = useCallback(() => createSubmitHandler(
        validate,
        setError,
        handleUpdateOrganizationSubmit,
    )(), [handleUpdateOrganizationSubmit, setError, validate]);

    const error = getErrorObject(formError);

    const handleImageClick = useCallback(() => {
        document.getElementById('OrganizationImage')?.click();
    }, []);

    return (
        <Page className={styles.mainContent}>
            <Container className={styles.editOrganization}>
                <Container className={styles.formContent}>
                    <form className={styles.form} onSubmit={handleSubmit}>
                        <div className={styles.organizationAction}>
                            <Avatar
                                className={styles.roundImage}
                                src={organizationImagePreview}
                                alt="Organization Logo"
                            />
                            <Button
                                className={styles.uploadButton}
                                variant="default"
                                name="uploadImage"
                                onClick={handleImageClick}
                            >
                                Change
                            </Button>
                            <input
                                type="file"
                                accept="image/*"
                                style={{ display: 'none' }}
                                id="OrganizationImage"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        handleUpdateOrganizationSubmit(value, file);
                                    }
                                }}
                            />
                        </div>
                        <TextInput
                            className={styles.fullSizeInput}
                            name="organization"
                            label="Organization Name"
                            value={value?.organization}
                            error={error?.organization}
                            onChange={setFieldValue}
                        />
                        <ColorInput
                            label="Primary Color"
                            name="navbarColor"
                            onChange={setFieldValue}
                        />
                        <ColorInput
                            label="Accent Color"
                            name="sliderBarColor"
                            onChange={setFieldValue}
                        />
                        <div className={styles.actions}>
                            <Button type="button" variant="default" name={undefined}>
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                variant="primary"
                                name={undefined}
                            >
                                Save Changes
                            </Button>
                        </div>
                    </form>
                </Container>
            </Container>
        </Page>
    );
}

Component.displayName = 'EditOrganizationProfile';
