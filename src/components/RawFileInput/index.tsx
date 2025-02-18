import {
    useCallback,
    useState,
} from 'react';
import { IoDocument } from 'react-icons/io5';
import {
    _cs,
    randomString,
} from '@togglecorp/fujs';

import styles from './styles.module.css';

export interface Props<NAME> {
    className?: string;
    name: NAME;
    value: string | undefined | null;
    accept?: string;
    inputProps?: React.ComponentPropsWithoutRef<'input'>;
    inputRef?: React.RefObject<HTMLInputElement>;
    onChange: (files: File | undefined, name: NAME) => void;
    disabled?: boolean;
    readOnly?: boolean;
}

function RawFileInput<NAME>(props: Props<NAME>) {
    const {
        className,
        accept,
        inputProps,
        inputRef,
        name,
        onChange,
        disabled,
        readOnly,
    } = props;

    const [inputId] = useState(randomString);

    const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        onChange(event.currentTarget.files?.[0] ?? undefined, name);

        if (event.currentTarget.value) {
            event.currentTarget.value = ''; // eslint-disable-line no-param-reassign
        }
    }, [name, onChange]);

    return (
        <label
            htmlFor={inputId}
            className={_cs(styles.fileInput, className)}
        >
            <div className={styles.icon}>
                <IoDocument />
                <div className={styles.uploadText}>
                    Upload the Document
                </div>
            </div>
            <div className={styles.browseButton}>
                Browse
                <input
                    id={inputId}
                    className={styles.input}
                    type="file"
                    accept={accept}
                    onChange={handleChange}
                    name={typeof name === 'string' ? name : undefined}
                    ref={inputRef}
                    disabled={disabled}
                    readOnly={readOnly}
                    {...inputProps} // eslint-disable-line react/jsx-props-no-spreading
                />
            </div>
        </label>
    );
}

export default RawFileInput;
