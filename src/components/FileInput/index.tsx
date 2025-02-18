import {
    InputContainer,
    type InputContainerProps,
} from '@togglecorp/toggle-ui';

import RawFileInput, { type Props as RawInputFileProps } from '#components/RawFileInput';

import styles from './styles.module.css';

type InheritedProps<T> = (Omit<InputContainerProps, 'input'> & Omit<RawInputFileProps<T>, 'type'>);

interface Props<T> extends InheritedProps<T> {
    accept?: string;
    disabled?: boolean;
    readOnly?: boolean;
}
function FileInput<T>(props: Props<T>) {
    const {
        accept,
        disabled,
        readOnly,
        name,
        value,
        onChange,
    } = props;

    return (
        <InputContainer
            label="File Upload"
            inputSectionClassName={styles.inputContainer}
            input={(
                <RawFileInput
                    onChange={onChange}
                    name={name}
                    value={value}
                    accept={accept}
                    disabled={disabled}
                    readOnly={readOnly}
                    className={styles.fileInputContainer}
                />
            )}
        />
    );
}

export default FileInput;
