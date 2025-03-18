import { useCallback } from 'react';
import {
    IoCheckmarkCircleOutline,
    IoCloseOutline,
    IoInformationCircleOutline,
    IoWarningOutline,
} from 'react-icons/io5';
import { _cs } from '@togglecorp/fujs';
import { Button } from '@togglecorp/toggle-ui';

import Container from '#components/Container';
import { AlertType } from '#contexts/alert';

import styles from './styles.module.css';

interface Props<N> {
    name: N;
    className?: string;
    type?: AlertType;
    title?: React.ReactNode;
    description?: React.ReactNode;
    nonDismissable?: boolean;
    onCloseButtonClick?: (name: N) => void;
}

const alertTypeToClassNameMap: Record<AlertType, string> = {
    success: styles.success,
    warning: styles.warning,
    danger: styles.danger,
    info: styles.info,
};

const icon: Record<AlertType, React.ReactNode> = {
    success: <IoCheckmarkCircleOutline className={styles.icon} />,
    danger: <IoWarningOutline className={styles.icon} />,
    info: <IoInformationCircleOutline className={styles.icon} />,
    warning: <IoWarningOutline className={styles.icon} />,
};

function Alert<N extends string>(props: Props<N>) {
    const {
        className,
        type = 'info',
        title,
        description,
        nonDismissable,
        onCloseButtonClick,
        name,
    } = props;

    const handleCloseButtonClick = useCallback(
        () => {
            if (onCloseButtonClick) {
                onCloseButtonClick(name);
            }
        },
        [onCloseButtonClick, name],
    );

    return (
        <Container
            className={_cs(
                styles.alert,
                alertTypeToClassNameMap[type],
                className,
            )}
            icons={icon[type]}
            heading={title}
            headingLevel={5}
            showHeader
            actions={!nonDismissable && (
                <Button
                    name={undefined}
                    onClick={handleCloseButtonClick}
                    variant="default"
                    title="Close"
                >
                    <IoCloseOutline className={styles.closeIcon} />
                </Button>
            )}
        >
            {description}
        </Container>
    );
}

export default Alert;
