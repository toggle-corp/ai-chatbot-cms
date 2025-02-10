import { useCallback } from 'react';
import {
    IoEllipsisVertical,
    IoPencil,
} from 'react-icons/io5';
import { Button } from '@togglecorp/toggle-ui';

import styles from './styles.module.css';

function UserActions() {
    const handleClick = useCallback(() => {
    }, []);

    return (
        <div className={styles.userActions}>
            <Button
                className={styles.actionButton}
                name={undefined}
                onClick={handleClick}
                title="Edit"
                transparent
            >
                <IoPencil className={styles.icons} />
            </Button>
            <Button
                className={styles.actionButton}
                name={undefined}
                onClick={handleClick}
                title="More"
                transparent
            >
                <IoEllipsisVertical className={styles.icons} />
            </Button>
        </div>
    );
}

export default UserActions;
