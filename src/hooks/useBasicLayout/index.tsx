import {
    _cs,
    isNotDefined,
} from '@togglecorp/fujs';

import styles from './styles.module.css';

interface Props {
    className?: string;
    icons?: React.ReactNode;
    children: React.ReactNode;
    actions?: React.ReactNode;
    description?: React.ReactNode;
    iconsContainerClassName?: string;
    childrenContainerClassName?: string;
    actionsContainerClassName?: string;
}
function useBasicLayout(props: Props) {
    const {
        className,
        icons,
        children,
        actions,
        iconsContainerClassName,
        childrenContainerClassName,
        actionsContainerClassName,
    } = props;

    const emptyContent = isNotDefined(icons)
            && isNotDefined(children)
            && isNotDefined(actions);

    const containerClassName = _cs(
        styles.basicLayout,
        className,
    );
    const content = emptyContent ? null : (
        <>
            {icons && (
                <div
                    className={_cs(
                        styles.iconsContainer,
                        iconsContainerClassName,
                    )}
                >
                    {icons}
                </div>
            )}
            <div
                className={_cs(
                    styles.childrenContainer,
                    childrenContainerClassName,
                )}
            >
                {children}
            </div>
            {actions && (
                <div
                    className={_cs(
                        styles.actionsContainer,
                        actionsContainerClassName,
                    )}
                >
                    {actions}
                </div>
            )}
        </>
    );

    return {
        containerClassName,
        content,
    };
}

export default useBasicLayout;
