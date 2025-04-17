import React from 'react';
import {
    ColorResult,
    TwitterPicker,
} from 'react-color';

import styles from './styles.module.css';

type NameType = string | number | undefined;

 interface Props<N extends NameType> {
    className?: string;
    value?: string;
    onChange: (newValue: string, name: N) => void;
    name: N,
    label?: React.ReactNode;
}

function ColorInput<N extends NameType>(props: Props<N>) {
    const {
        className,
        onChange,
        value,
        name,
        label,
    } = props;

    const handleColorChange = React.useCallback((newValue: ColorResult) => {
        onChange(newValue.hex, name);
    }, [onChange, name]);

    return (
        <div className={styles.colorInput}>
            {label}
            <TwitterPicker
                className={className}
                color={value}
                onChange={handleColorChange}
            />
        </div>

    );
}

export default ColorInput;
