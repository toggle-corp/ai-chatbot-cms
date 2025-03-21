import {
    useCallback,
    useContext,
    useMemo,
} from 'react';
import { randomString } from '@togglecorp/fujs';

import AlertContext, { AlertType } from '#contexts/alert';

interface AddAlertOption {
    name?: string;
    variant?: AlertType;
    duration?: number;
    description?: React.ReactNode;
    nonDismissable?: boolean;
}

function useAlert() {
    const { addAlert } = useContext(AlertContext);

    const DURATION_DEFAULT_ALERT_DISMISS = 4500;

    const show = useCallback((title: React.ReactNode, options?: AddAlertOption) => {
        const name = options?.name ?? randomString(16);
        addAlert({
            variant: options?.variant ?? 'info',
            duration: options?.duration ?? DURATION_DEFAULT_ALERT_DISMISS,
            name: options?.name ?? name,
            title,
            description: options?.description,
            nonDismissable: options?.nonDismissable ?? false,
        });

        return name;
    }, [addAlert]);

    return useMemo(() => ({
        show,
    }), [show]);
}

export default useAlert;
