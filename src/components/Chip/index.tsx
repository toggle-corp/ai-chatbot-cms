import React from 'react';
import { _cs } from '@togglecorp/fujs';

import styles from './styles.module.css';

export type ChipVariant = 'default' | 'primary' |'success'| 'danger' | 'warning';

const chipVariantToClassNameMap: Record<ChipVariant, string> = {
    default: styles.default,
    primary: styles.primary,
    success: styles.success,
    danger: styles.danger,
    warning: styles.warning,
};
 interface Props {
    className?: string;
    label: React.ReactNode;
    variant?: ChipVariant;
}

function Chip(props: Props) {
    const {
        className,
        label,
        variant = 'primary',
    } = props;

    return (
        <div className={_cs(
            styles.chip,
            chipVariantToClassNameMap[variant],
            className,
        )}
        >
            <span className={styles.label}>
                {label}
            </span>

        </div>
    );
}

export default Chip;
