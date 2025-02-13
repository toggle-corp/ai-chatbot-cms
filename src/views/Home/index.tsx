import {
    IoDocumentText,
    IoGrid,
    IoPerson,
} from 'react-icons/io5';
import { Outlet } from 'react-router-dom';

import Navbar from '#components/Navbar';
import NavigationTab from '#components/NavigationTab';
import Page from '#components/Page';

/** @knipignore */
// eslint-disable-next-line import/prefer-default-export
export function Component() {
    return (
        <>
            <Navbar />
            <Page
                leftPaneContent={(
                    <>
                        <NavigationTab
                            to="dashboard"
                            icon={<IoGrid />}
                        >
                            Dashboard
                        </NavigationTab>
                        <NavigationTab
                            to="contentManagement"
                            icon={<IoDocumentText />}
                        >
                            Content Management
                        </NavigationTab>
                        <NavigationTab
                            to="userManagement"
                            icon={<IoPerson />}
                        >
                            User Management
                        </NavigationTab>
                    </>
                )}
            >
                <Outlet />
            </Page>
        </>
    );
}

Component.displayName = 'Home';
