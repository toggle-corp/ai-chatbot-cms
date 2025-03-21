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

interface Props {
    className?: string;
    type?: AlertType;
    title?: React.ReactNode;
    description?: React.ReactNode;
    nonDismissable?: boolean;
}

const alertTypeToClassNameMap: {
    [key in AlertType]: string;
} = {
    success: styles.success,
    warning: styles.warning,
    danger: styles.danger,
    info: styles.info,
};

const icon: {
    [key in AlertType]: React.ReactNode;
} = {
    success: <IoCheckmarkCircleOutline className={styles.icon} />,
    danger: <IoWarningOutline className={styles.icon} />,
    info: <IoInformationCircleOutline className={styles.icon} />,
    warning: <IoWarningOutline className={styles.icon} />,
};

function Alert(props: Props) {
    const {
        className,
        type = 'info',
        title,
        description,
        nonDismissable,
    } = props;

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
                    variant="default"
                    title="Close"
                    transparent
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
