import {
    ElementRef,
    RefObject,
} from 'react';
import { _cs } from '@togglecorp/fujs';

import styles from './styles.module.css';

interface Props {
    className?: string;
    children?: React.ReactNode;
    elementRef?: RefObject<ElementRef<'div'>>;
    leftPaneContent?: React.ReactNode;
    leftPaneContainerClassName?: string;
}
function Page(props: Props) {
    const {
        className,
        children,
        elementRef,
        leftPaneContent,
        leftPaneContainerClassName,
    } = props;

    return (
        <div className={_cs(className, styles.page)} ref={elementRef}>
            {leftPaneContent && (
                <div className={_cs(leftPaneContainerClassName, styles.leftPane)}>
                    {leftPaneContent}
                </div>
            )}
            {children}
        </div>
    );
}

export default Page;
