import {
    useContext,
    useEffect,
    useRef,
} from 'react';
import { _cs } from '@togglecorp/fujs';
import { Portal } from '@togglecorp/toggle-ui';

import Alert from '#components/Alert';
import AlertContext from '#contexts/alert';

import styles from './styles.module.css';

interface Props {
    className?: string;
    children?: React.ReactNode;
}

function AlertContainer(props: Props) {
    const { className, children } = props;
    const { alerts, removeAlert } = useContext(AlertContext);

    const DURATION_DEFAULT_ALERT_DISMISS = 4500;

    const dismissTimeout = useRef<Record<string, number>>({});

    useEffect(() => {
        alerts.filter((alert) => !alert.nonDismissable).forEach((alert) => {
            if (dismissTimeout.current[alert.name]) {
                return;
            }
            dismissTimeout.current[alert.name] = window.setTimeout(() => {
                removeAlert(alert.name);
                delete dismissTimeout.current[alert.name];
            }, alert.duration ?? DURATION_DEFAULT_ALERT_DISMISS);
        });
    }, [alerts, removeAlert]);

    return (
        <Portal>
            <div className={_cs(styles.alertContainer, className)}>
                {alerts.map((alert) => (
                    <Alert
                        key={alert.name}
                        className={styles.alert}
                        nonDismissable={alert.nonDismissable}
                        type={alert.variant}
                        title={alert.title}
                        description={alert.description}
                    />
                ))}
                {children}
            </div>
        </Portal>
    );
}

export default AlertContainer;
