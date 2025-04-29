import {
    useCallback,
    useState,
} from 'react';
import {
    gql,
    useMutation,
} from '@apollo/client';
import {
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
                result {
                    id
                    name
                    navbarColor
                    sliderBarColor
                }
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
        name: {
            required: true,
            requiredValidation: requiredStringCondition,
        },
    }),
};
const defaultFormValues: PartialFormType = {};

/** @knipignore */
// eslint-disable-next-line import/prefer-default-export
export function Component() {
    const alert = useAlert();
    const [
        organizationImagePreview,
        setOrganizationImagePreview,
    ] = useState<string | undefined>(undefined);

    const {
        value,
        error: formError,
        setFieldValue,
        validate,
        setError,
        setValue,
    } = useForm(EditOrganizationProfileSchema, { value: defaultFormValues });
    const [triggerUpdateOrganization, { loading }] = useMutation<
        UpdateOrganizationMutation,
        UpdateOrganizationMutationVariables
    >(UPDATE_ORGANIZATION, {
        onCompleted: (response) => {
            if (response.private.updateOrganization.ok) {
                alert.show(
                    'Successfully updated!',
                    { variant: 'success' },
                );
            } else {
                setError(transformToFormError(response.private.updateOrganization.errors));
                const errorMessages = response.private.updateOrganization.errors
                    ?.map((error: { messages: string; }) => error.messages)
                    .filter(Boolean)
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
    });
    const handleImageClick = useCallback(() => {
        const fileInput = document.getElementById('OrganizationImage');
        if (fileInput) {
            fileInput.click();
        }
    }, []);

    const handleOrganizationImageChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            const image = event.target.files?.[0];
            if (image) {
                const imageBlob = URL.createObjectURL(image);
                setOrganizationImagePreview(imageBlob);
                setFieldValue(image, 'image');
            } else {
                setOrganizationImagePreview(undefined);
                setFieldValue(null, 'image');
            }
        },
        [setFieldValue],
    );
    const handleSubmit = useCallback(
        (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            const isValid = validate();
            if (isValid) {
                const input: UpdateOrganizationInputType = {
                    ...value,
                    name: value.name || '',
                    image: value.image instanceof File ? value.image : undefined,
                    organization: value.organization || '',
                };

                triggerUpdateOrganization({
                    variables: { input },
                    context: { hasUpload: true },
                });
            }
        },
        [validate, triggerUpdateOrganization, value],
    );
    const handleCancel = useCallback(() => {
        setValue(defaultFormValues);
        setOrganizationImagePreview(undefined);
    }, [setValue]);

    const error = getErrorObject(formError);
    return (
        <Page className={styles.mainContent}>
            <Container className={styles.editOrganization}>
                <Container className={styles.formContent}>
                    <form
                        className={styles.form}
                        onSubmit={handleSubmit}
                    >
                        <div className={styles.organizationAction}>
                            <Avatar
                                className={styles.roundImage}
                                src={organizationImagePreview}
                                alt={`${value.name}`}
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
                                onChange={handleOrganizationImageChange}
                            />
                        </div>
                        <TextInput
                            className={styles.fullSizeInput}
                            name="name"
                            label="Organization Name"
                            value={value?.name}
                            error={error?.name}
                            onChange={setFieldValue}
                        />
                        <ColorInput
                            label="Primary Color"
                            name="navbarColor"
                            onChange={setFieldValue}
                            value={value.navbarColor ?? ''}
                        />
                        <ColorInput
                            label="Accent Color"
                            name="sliderBarColor"
                            onChange={setFieldValue}
                            value={value.sliderBarColor ?? ''}
                        />
                        <div className={styles.actions}>
                            <Button
                                type="button"
                                variant="default"
                                name={undefined}
                                onClick={handleCancel}
                                disabled={loading}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                variant="primary"
                                name={undefined}
                                disabled={loading}
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
