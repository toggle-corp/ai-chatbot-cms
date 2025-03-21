import { _cs } from '@togglecorp/fujs';

import Footer from '#components/Footer';
import Header from '#components/Header';
import { type Props as HeadingProps } from '#components/Heading';

import styles from './styles.module.css';

interface Props {
    actions?: React.ReactNode;
    actionsContainerClassName?: string;
    className?: string;
    containerRef?: React.RefObject<HTMLDivElement>;
    children?: React.ReactNode;
    withHeaderBorder?: boolean,
    showHeader?: boolean,
    headerDescription?: string;
    heading?: React.ReactNode;
    headingClassName?: string;
    headingContainerClassName?: string;
    headingLevel?: HeadingProps['level'],
    headingSectionClassName?: string;
    icons?: React.ReactNode;
    iconsContainerClassName?: string;
    headingDescription?: React.ReactNode;
    headingDescriptionContainerClassName?: string;
    headerDescriptionContainerClassName?: string;
    childrenContainerClassName?: string;

    footerActions?: React.ReactNode;
    footerActionsContainerClassName?: string;
    footerClassName?: string;
    footerContent?: React.ReactNode;
    footerContentClassName?: string;
    footerIcons?: React.ReactNode;
    withFooterBorder?: boolean;

}

function Container(props: Props) {
    const {
        actions,
        actionsContainerClassName,
        className,
        containerRef,
        children,
        withHeaderBorder = false,
        showHeader,
        headerDescription,
        heading,
        headingLevel,
        headingSectionClassName,
        headingClassName,
        headingContainerClassName,
        headingDescription,
        headerDescriptionContainerClassName,
        headingDescriptionContainerClassName,
        icons,
        childrenContainerClassName,
        iconsContainerClassName,

        footerActions,
        footerActionsContainerClassName,
        footerClassName,
        footerContent,
        footerContentClassName,
        withFooterBorder,
        footerIcons,
    } = props;

    const showFooter = footerIcons || footerContent || footerActions;

    if (
        !children
        && !showHeader
        && !showFooter
    ) {
        return null;
    }

    return (
        <div
            ref={containerRef}
            className={_cs(className, styles.container)}
        >
            {showHeader && (
                <Header
                    icons={icons}
                    iconsContainerClassName={iconsContainerClassName}
                    actions={actions}
                    actionsContainerClassName={actionsContainerClassName}
                    heading={heading}
                    headingLevel={headingLevel}
                    headingClassName={headingClassName}
                    headingSectionClassName={headingSectionClassName}
                    headingContainerClassName={headingContainerClassName}
                    headingDescription={headingDescription}
                    headingDescriptionContainerClassName={headingDescriptionContainerClassName}
                    childrenContainerClassName={_cs(
                        headerDescriptionContainerClassName,
                    )}
                >
                    {headerDescription}
                </Header>
            )}
            {withHeaderBorder && <div className={styles.border} />}
            <div className={childrenContainerClassName}>
                {children}
            </div>
            {showFooter && withFooterBorder && <div className={styles.border} />}
            {showFooter && (
                <Footer
                    actions={footerActions}
                    icons={footerIcons}
                    childrenContainerClassName={footerContentClassName}
                    className={_cs(
                        styles.footer,
                        footerClassName,
                    )}
                    actionsContainerClassName={footerActionsContainerClassName}
                >
                    {footerContent}
                </Footer>
            )}
        </div>
    );
}

export default Container;
