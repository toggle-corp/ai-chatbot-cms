import {
    IoEllipsisVertical,
    IoPencil,
} from 'react-icons/io5';
import { Button } from '@togglecorp/toggle-ui';

import styles from './styles.module.css';

interface Props {
    userId: string;
    onEdit: (userId: string) => void;
}

function UserActions({
    userId, onEdit,
}: Props) {
    const handleEditClick = () => {
        onEdit(userId);
    };

    return (
        <div className={styles.userActions}>
            <Button
                name={undefined}
                onClick={handleEditClick}
                title="Edit"
                transparent
            >
                <IoPencil />
            </Button>
            <Button
                name={undefined}
                onClick={() => {}}
                title="More"
                transparent
            >
                <IoEllipsisVertical />
            </Button>
        </div>
    );
}

export default UserActions;
