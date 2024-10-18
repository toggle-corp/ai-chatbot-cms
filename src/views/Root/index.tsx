import { Outlet } from 'react-router-dom';

/** @knipignore */
// eslint-disable-next-line import/prefer-default-export
export function Component() {
    return (
        <Outlet />
    );
}

Component.displayName = 'App';
