import {
    gql,
    useQuery,
} from '@apollo/client';
import { Button } from '@togglecorp/toggle-ui';

import Container from '#components/Container';

import styles from './styles.module.css';

const CONTENT_QUERY = gql`
    query CONTENT_LIST {
        private {
            content {
                count
                items {
                    id
                    title
                    createdAt
                    modifiedAt
                    documentTypeDisplay
                    documentStatusDisplay
                    tag {
                        name
                        id
                    }
                }
            }
        }
    }
`;

/** @knipignore */
// eslint-disable-next-line import/prefer-default-export
export function Component() {
    const {
        loading,
        data: contentResult,
    } = useQuery(
        CONTENT_QUERY,
    );

    return (
        <Container
            className={styles.container}
            showHeader
            heading="Content"
            actions={(
                <Button
                    name="Add Content"
                    variant="primary"
                >
                    Add
                </Button>
            )}
        >
            Content Management
        </Container>
    );
}

Component.displayName = 'ContentManagement';
