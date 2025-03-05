import { IoEllipsisVertical } from 'react-icons/io5';
import { Button } from '@togglecorp/toggle-ui';

import styles from './styles.module.css';

function UserActions() {
    return (
        // FIXME:Add DropdownMenu instead of button
        <div className={styles.userActions}>
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
