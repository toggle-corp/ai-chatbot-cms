import Navbar from '#components/Navbar';

/** @knipignore */
// eslint-disable-next-line import/prefer-default-export
export function Component() {
    return (
        <>
            <Navbar />
            <h1>
                Dashboard
            </h1>
        </>
    );
}

Component.displayName = 'Home';
