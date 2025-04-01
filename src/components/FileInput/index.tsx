import {
    useCallback,
    useState,
} from 'react';
import {
    _cs,
    isDefined,
} from '@togglecorp/fujs';
import {
    InputContainer,
    type InputContainerProps,
    useButtonFeatures,
} from '@togglecorp/toggle-ui';

import Header from '#components/Header';
import RawFileInput, { type RawFileInputProps } from '#components/RawFileInput';
import useDropHandler from '#hooks/useDropHandler';
import isValidFile, { ErrorType } from '#utils/common';

import styles from './styles.module.css';

type NameType = string | number | undefined;

type InheritedProps<T extends NameType> = (Omit<InputContainerProps, 'input'> & Omit<RawFileInputProps<T>, 'onChange' | 'value'>);
export type Props<T extends NameType> = InheritedProps<T> & {
    inputElementRef?: React.RefObject<HTMLInputElement>;
    inputClassName?: string;
    labelClassName?: string;

    status?: string;
    maxFileSize?: number; // NOTE: maxFileSize is in MB.
} & ({
    multiple: true;
    value: File[] | undefined | null;
    onChange?: (files: File[], name: T) => void;
} | {
    multiple?: false;
    value: File | undefined | null;
    onChange?: (files: File | undefined, name: T) => void;
});

function FileInput<T extends NameType>(props: Props<T>) {
    const {
        className,
        disabled,
        error,
        errorContainerClassName,
        inputSectionClassName,
        inputContainerClassName,
        label,
        labelContainerClassName,
        readOnly,
        uiMode,
        inputElementRef,
        containerRef,
        inputSectionRef,
        inputClassName,
        value, // eslint-disable-line @typescript-eslint/no-unused-vars
        onChange, // eslint-disable-line @typescript-eslint/no-unused-vars
        name: nameFromProps,
        multiple,
        accept,
        labelClassName,
        children,
        maxFileSize = 10, // 10MB is default max file size
        ...fileInputProps
    } = props;

    const [inputKey, setInputKey] = useState(0);
    const [internalError, setInternalError] = useState<string>();

    const handleFiles = useCallback(
        (files: FileList | null) => {
            setInternalError(undefined);
            // eslint-disable-next-line react/destructuring-assignment
            if (!files || !props.onChange) {
                return;
            }

            const fileList = Array.from(files);
            let numberOfFilesExceedSize = 0;
            let numberOfInvalidFiles = 0;

            const validFiles = fileList.filter((f) => {
                const validity = isValidFile(f, maxFileSize, accept);
                if (!validity.isValid) {
                    if (validity.errorType === ErrorType.invalidFileType) {
                        numberOfInvalidFiles += 1;
                    } else {
                        numberOfFilesExceedSize += 1;
                    }
                }
                return validity.isValid;
            });

            if (numberOfFilesExceedSize > 0 && numberOfInvalidFiles > 0) {
                const isSingularFileSizeError = numberOfFilesExceedSize === 1;
                const isSingularInvalidFileError = numberOfInvalidFiles === 1;
                setInternalError(`${numberOfFilesExceedSize} ${isSingularFileSizeError ? 'file exceeds' : 'files exceed'} file size limit of ${maxFileSize} MB.
                    ${numberOfFilesExceedSize} ${isSingularInvalidFileError ? 'file is' : 'files are'} invalid. They are removed from selection.`);
            } else if (numberOfFilesExceedSize > 0) {
                const isSingularError = numberOfFilesExceedSize === 1;
                setInternalError(`${numberOfFilesExceedSize} ${isSingularError ? 'file exceeds' : 'files exceed'} file size limit of ${maxFileSize} MB.
                    ${isSingularError ? 'It is' : 'They are'} removed from selection.`);
            } else if (numberOfInvalidFiles > 0) {
                const isSingularError = numberOfInvalidFiles === 1;
                setInternalError(`${numberOfFilesExceedSize} ${isSingularError ? 'file is' : 'files are'} invalid.
                    ${isSingularError ? 'It is' : 'They are'} removed from selection.`);
            }

            if (validFiles.length <= 0) {
                return;
            }

            if (!multiple) {
                const [firstFile] = validFiles;
                // eslint-disable-next-line react/destructuring-assignment
                const onChangeFromProps = props.onChange;
                onChangeFromProps(firstFile, nameFromProps);
            } else {
                // eslint-disable-next-line react/destructuring-assignment
                const onChangeFromProps = props.onChange;
                onChangeFromProps(validFiles, nameFromProps);
            }
        },
        // eslint-disable-next-line react/destructuring-assignment
        [accept, multiple, props.onChange, nameFromProps, maxFileSize],
    );

    const handleChange = useCallback((
        files: File[] | undefined,
    ) => {
        if (isDefined(files)) {
            handleFiles(files as unknown as FileList);
            setInputKey((val) => val + 1);
        }
    }, [handleFiles]);

    const handleDrop: React.DragEventHandler<HTMLDivElement> = useCallback((e) => {
        e.preventDefault();
        handleFiles(e.dataTransfer.files);
        e.dataTransfer.clearData();
    }, [handleFiles]);

    const {
        dropping,
        onDragOver,
        onDragEnter,
        onDragLeave,
        onDrop,
    } = useDropHandler(handleDrop);

    const {
        className: buttonLabelClassName,
        children: buttonLabelChildren,
    } = useButtonFeatures({
        className: labelClassName,
        disabled,
        variant: 'primary',
        children: (
            <>
                {children}
                <RawFileInput<T>
                    key={inputKey}
                    className={styles.input}
                    inputRef={inputElementRef}
                    readOnly={readOnly}
                    uiMode={uiMode}
                    disabled={disabled}
                    value={undefined}
                    name={nameFromProps}
                    onChange={handleChange}
                    multiple={multiple}
                    accept={accept}
                    {...fileInputProps} // eslint-disable-line react/jsx-props-no-spreading
                />
            </>
        ),
    });

    return (
        <InputContainer
            className={_cs(styles.inputContainer, className)}
            containerRef={containerRef}
            inputContainerClassName={_cs(inputContainerClassName)}
            inputSectionClassName={_cs(styles.inputSection, inputSectionClassName)}
            labelContainerClassName={_cs(styles.label, labelContainerClassName)}
            errorContainerClassName={errorContainerClassName}
            inputSectionRef={inputSectionRef}
            disabled={disabled}
            error={error ?? internalError}
            label={label}
            readOnly={readOnly}
            input={(
                <div
                    className={_cs(
                        inputClassName,
                        styles.inputChildren,
                        dropping && styles.draggedOver,
                    )}
                    onDrop={onDrop}
                    onDragOver={onDragOver}
                    onDragEnter={onDragEnter}
                    onDragLeave={onDragLeave}
                >
                    <Header
                        childrenContainerClassName={styles.headerChildren}
                        headingLevel={6}
                        heading="Choose a file or drag & drop it here"
                        headingDescription="Format: PDF, XLSX, DOCX"
                    />
                    <div className={styles.browseButton}>
                        <label className={buttonLabelClassName}>
                            {buttonLabelChildren}
                        </label>
                        Upto 5 MB
                    </div>
                </div>
            )}
        />
    );
}

export default FileInput;
