import { Outlet } from 'react-router-dom';

import AlertContainer from '#components/AlertContainer';

import styles from './styles.module.css';

// eslint-disable-next-line import/prefer-default-export
export function Component() {
    return (
        <div className={styles.root}>
            <div className={styles.pageContent}>
                <Outlet />
            </div>
            <AlertContainer />
        </div>
    );
}

Component.displayName = 'Root';
