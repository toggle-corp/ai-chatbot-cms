import Navbar from '#components/Navbar';
import Page from '#components/Page';
import ContentManagement from '#views/ContentManagement';

/** @knipignore */
// eslint-disable-next-line import/prefer-default-export
export function Component() {
    return (
        <>
            <Navbar />
            <Page
                leftPaneContent={(
                    <>
                        <div>Dashboard</div>
                        <div>Content Management</div>
                        <div>User Management</div>
                    </>
                )}
            >
                <ContentManagement />
            </Page>
        </>
    );
}

Component.displayName = 'Home';
