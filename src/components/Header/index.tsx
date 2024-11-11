import { useMemo } from 'react';
import {
    _cs,
    isNotDefined,
} from '@togglecorp/fujs';

import Heading, { Props as HeadingProps } from '#components/Heading';
import useBasicLayout from '#hooks/useBasicLayout';

import styles from './styles.module.css';

interface Props {
    className?: string;
    elementRef?: React.Ref<HTMLDivElement>;

    children?: React.ReactNode;
    childrenContainerClassName?: string;

    actions?: React.ReactNode;
    actionsContainerClassName?: string;

    icons?: React.ReactNode;
    iconsContainerClassName?: string;

    heading: React.ReactNode;
    headingLevel?: HeadingProps['level'];
    headingSectionClassName?: string;
    headingContainerClassName?: string;
    headingClassName?: string;
    headingDescription?: React.ReactNode;
    headingDescriptionContainerClassName?: string;
}

function Header(props: Props) {
    const {
        className,
        elementRef,
        actions,
        actionsContainerClassName,
        children,
        childrenContainerClassName,
        headingLevel,
        heading,
        headingClassName,
        headingSectionClassName,
        headingContainerClassName,
        headingDescription,
        headingDescriptionContainerClassName,
        icons,
        iconsContainerClassName,
    } = props;

    const headingChildren = useMemo(
        () => {
            if (isNotDefined(heading) && isNotDefined(headingDescription)) {
                return null;
            }

            return (
                <>
                    <Heading
                        level={headingLevel}
                        className={headingClassName}
                    >
                        {heading}
                    </Heading>
                    {headingDescription && (
                        <div className={headingDescriptionContainerClassName}>
                            {headingDescription}
                        </div>
                    )}
                </>
            );
        },
        [
            heading,
            headingDescription,
            headingClassName,
            headingDescriptionContainerClassName,
            headingLevel,
        ],
    );

    const {
        content,
        containerClassName,
    } = useBasicLayout({
        actions,
        actionsContainerClassName,
        children: headingChildren,
        childrenContainerClassName: headingContainerClassName,
        className: headingSectionClassName,
        icons,
        iconsContainerClassName,
    });

    if (!content && !children) {
        return null;
    }

    return (
        <div
            className={_cs(
                styles.header,
                className,
            )}
            ref={elementRef}
        >
            {content && (
                <div className={containerClassName}>
                    {content}
                </div>
            )}
            {children && (
                <div className={childrenContainerClassName}>
                    {children}
                </div>
            )}
        </div>
    );
}

export default Header;
