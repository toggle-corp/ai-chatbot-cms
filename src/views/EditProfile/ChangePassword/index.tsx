import { useCallback } from 'react';
import {
    gql,
    useMutation,
} from '@apollo/client';
import { isTruthyString } from '@togglecorp/fujs';
import {
    createSubmitHandler,
    getErrorObject,
    nonFieldError,
    ObjectSchema,
    PartialForm,
    requiredStringCondition,
    useForm,
} from '@togglecorp/toggle-form';
import { PasswordInput } from '@togglecorp/toggle-ui';

import {
    ChangePasswordInput,
    ChangePasswordMutation,
    ChangePasswordMutationVariables,
} from '#generated/types/graphql';
import useAlert from '#hooks/useAlert';
import { transformToFormError } from '#utils/errorTransform';

import styles from './styles.module.css';

const CHANGE_PASSWORD = gql`
    mutation ChangePassword($input:  ChangePasswordInput!) {
        private {
            changePassword(data: $input) {
                ok
                errors
            }
        }
       
    }
`;

type PartialFormType = PartialForm<ChangePasswordInput> & { confirmNewPassword: string };
type FormSchema = ObjectSchema<PartialForm<PartialFormType>>;
type FormSchemaFields = ReturnType<FormSchema['fields']>;

function getPasswordMatchCondition(referenceVal: string | undefined) {
    return (val: string | undefined) => {
        if (isTruthyString(val) && isTruthyString(referenceVal) && val !== referenceVal) {
            return 'Passwords do not match';
        }
        return undefined;
    };
}

const changePasswordSchema: FormSchema = {
    fields: (value): FormSchemaFields => {
        const baseSchema = {
            oldPassword: {
                required: true,
                requiredValidation: requiredStringCondition,
            },
            newPassword: {
                required: true,
                requiredValidation: requiredStringCondition,
            },
            confirmNewPassword: {
                required: true,
                requiredValidation: requiredStringCondition,
                validations: [getPasswordMatchCondition(value?.newPassword)],
            },
        } as FormSchemaFields;

        return baseSchema;
    },
};

const defaultFormValue: PartialForm<PartialFormType> = {};

function ChangePasswordForm() {
    const alert = useAlert();
    const {
        value,
        setFieldValue,
        error: formError,
        validate,
        setError,
    } = useForm(changePasswordSchema, { value: defaultFormValue });

    const [
        changePasswordTrigger,
        { loading },
    ] = useMutation<ChangePasswordMutation, ChangePasswordMutationVariables>(
        CHANGE_PASSWORD,
        {
            onCompleted: (response) => {
                const { private: changePasswordResponse } = response;
                if (!changePasswordResponse) {
                    return;
                }

                if (changePasswordResponse?.changePassword.ok) {
                    alert.show(
                        'Successfully changed password.',
                        { variant: 'success' },
                    );
                } else {
                    setError(transformToFormError(
                        changePasswordResponse.changePassword?.errors,
                    ));
                    const errorMessages = changePasswordResponse.changePassword?.errors
                        ?.map((err: { messages: string; }) => err.messages)
                        .filter((message: string) => message)
                        .join(', ');
                    alert.show(errorMessages, { variant: 'danger' });
                }
            },
            onError: (errors) => {
                setError({ [nonFieldError]: errors.message });
                alert.show(
                    'Failed to change password.',
                    { variant: 'danger' },
                );
            },
        },
    );

    const handleSubmit = useCallback(() => {
        const submit = createSubmitHandler(
            validate,
            setError,
            (val) => {
                changePasswordTrigger({
                    variables: {
                        input: {
                            oldPassword: val.oldPassword,
                            newPassword: val.newPassword,
                        } as ChangePasswordInput,
                    },
                });
            },
        );
        submit();
    }, [validate, setError, changePasswordTrigger]);

    const errorObject = getErrorObject(formError);

    return (
        <form
            className={styles.form}
            onSubmit={handleSubmit}
        >
            <PasswordInput
                name="oldPassword"
                label="Old Password"
                value={value.oldPassword}
                onChange={setFieldValue}
                error={errorObject?.oldPassword}
                disabled={loading}
            />
            <PasswordInput
                name="newPassword"
                label="New Password"
                value={value.newPassword}
                onChange={setFieldValue}
                error={errorObject?.newPassword}
                disabled={loading}
            />
            <PasswordInput
                name="confirmNewPassword"
                label="Confirm New Password"
                value={value.confirmNewPassword}
                onChange={setFieldValue}
                error={errorObject?.confirmNewPassword}
                disabled={loading}
            />
        </form>
    );
}

export default ChangePasswordForm;
