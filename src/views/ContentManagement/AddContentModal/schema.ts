import {
    ArraySchema,
    ObjectSchema,
    requiredStringCondition,
} from '@togglecorp/toggle-form';

import { ContentCreateInput } from '#generated/types/graphql';

type Content = ContentCreateInput & { clientId: string };

type FormType = {
    contents: Content[];
}
export type PartialFormType = Partial<FormType>;

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
