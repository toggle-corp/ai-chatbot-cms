import {
    gql,
    useQuery,
} from '@apollo/client';
import {
    ArrayError,
    getErrorObject,
    SetValueArg,
    useFormObject,
} from '@togglecorp/toggle-form';
import {
    MultiSelectInput,
    TextInput,
} from '@togglecorp/toggle-ui';

import Container from '#components/Container';
import Heading from '#components/Heading';
import {
    TagsQuery,
    TagsQueryVariables,
} from '#generated/types/graphql';

import { PartialContentType } from '../schema';

import styles from './styles.module.css';
import { isNotDefined } from '@togglecorp/fujs';

const TAGS = gql`
    query Tags {
        private {
            tags {
                items {
                    name
                    id
                    description
                }
            }
        }
    }
`;

type TagsOptionsList = NonNullable<NonNullable<NonNullable<NonNullable<TagsQuery>['private']>['tags']>['items']>[number];

const tagsKeySelector = (option: TagsOptionsList) => option.id;
const tagsLabelSelector = (option: TagsOptionsList) => option.name;

const defaultValue: PartialContentType = {
    clientId: '-1',
    title: '',
};

interface Props {
    value: PartialContentType | undefined;
    error: ArrayError<PartialContentType> | undefined;
    index: number;
    onChange: (
        value: SetValueArg<PartialContentType>,
        index: number,
    ) => void;
}

function FormPreviewSection(props: Props) {
    const {
        value,
        error: errorFromProps,
        index,
        onChange,
    } = props;

    const {
        data: tagsResult,
    } = useQuery<TagsQuery, TagsQueryVariables>(
        TAGS,
    );

    const onUploadFormChange = useFormObject(index, onChange, defaultValue);

    const error = (value && value.clientId && errorFromProps)
        ? getErrorObject(errorFromProps?.[value.clientId])
        : undefined;

    if (isNotDefined(value)) {
        return <div>No file selected</div>;
    }

    return (
        <Container className={styles.previewSection}>
            <div>
                <Heading
                    level={6}
                >
                    File Details
                </Heading>
                <TextInput
                    required
                    name="title"
                    label="Title"
                    onChange={onUploadFormChange}
                    value={value.title}
                    error={error?.title}
                />
                <MultiSelectInput
                    name="tag"
                    label="Tags"
                    value={value.tag}
                    error={error?.tag}
                    onChange={onUploadFormChange}
                    options={tagsResult?.private.tags.items}
                    keySelector={tagsKeySelector}
                    labelSelector={tagsLabelSelector}
                />
            </div>
            <div>
                <iframe title="preview" src={value.documentFile} />
            </div>
        </Container>
    );
}

export default FormPreviewSection;
