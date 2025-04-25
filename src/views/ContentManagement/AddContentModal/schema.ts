import {
    ArraySchema,
    ObjectSchema,
    PartialForm,
    PurgeNull,
    requiredStringCondition,
} from '@togglecorp/toggle-form';

import { ContentCreateInput } from '#generated/types/graphql';
import { DeepReplace } from '#utils/common';

type ContentFormFields = ContentCreateInput & { clientId: string };

type FormType = {
    contents: ContentFormFields[];
}
type FormFields = DeepReplace<FormType, ContentCreateInput, ContentFormFields>

export type PartialFormType = PartialForm<
    PurgeNull<FormFields>,
    'clientId'
>;

export type FormSchema = ObjectSchema<PartialFormType>;
type FormSchemaFields = ReturnType<FormSchema['fields']>;

export type PartialContentType = NonNullable<PartialFormType['contents']>[number]

export type ContentsSchema = ArraySchema<PartialContentType, PartialFormType>;
type ContentsSchemaMember = ReturnType<ContentsSchema['member']>;

export type ContentFormSchema = ObjectSchema<PartialContentType, PartialFormType>;
export type ContentFormSchemaFields = ReturnType<ContentFormSchema['fields']>;

const createContentFormSchema: FormSchema = {
    fields: (): FormSchemaFields => ({
        contents: {
            keySelector: (content) => content.clientId,
            member: (): ContentsSchemaMember => ({
                fields: (): ContentFormSchemaFields => ({
                    clientId: {},
                    title: {
                        required: true,
                        requiredValidation: requiredStringCondition,
                    },
                    tag: {},
                    documentFile: {},
                }),
            }),
        },
    }),
};

export const defaultFormValues: PartialFormType = {
    contents: [],
};

export default createContentFormSchema;
