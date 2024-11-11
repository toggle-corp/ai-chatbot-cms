import { Outlet } from 'react-router-dom';

import styles from './styles.module.css';
/** @knipignore */
// eslint-disable-next-line import/prefer-default-export
export function Component() {
    return (
        <div className={styles.root}>
            <div className={styles.pageContent}>
                <Outlet />
            </div>
        </div>
    );
}

Component.displayName = 'Root';
