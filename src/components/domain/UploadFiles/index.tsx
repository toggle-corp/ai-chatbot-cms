import { useCallback } from 'react';
import {
    _cs,
    randomString,
} from '@togglecorp/fujs';

import FileInput from '#components/FileInput';

import styles from './styles.module.css';

export type FileLike = {
    key: string;
    id: string;
    name: string;
    fileType: string;
    file: File;
};

interface Props {
    className?: string;
    onAdd: (v: FileLike[]) => void;
    accept: string
}

function UploadFiles(props: Props) {
    const { onAdd, className, accept } = props;
    const handleFileInputChange = useCallback((values: File[] | null | undefined) => {
        const basicFiles = values
            ? values.map((file) => ({
                key: randomString(),
                id: file.name,
                name: file.name,
                fileType: file.type,
                file,
            }))
            : [];
        onAdd(basicFiles);
    }, [onAdd]);

    return (
        <FileInput
            className={_cs(styles.uploadFile, className)}
            name="uploadFiles"
            value={null}
            onChange={handleFileInputChange}
            label="Upload file"
            accept={accept}
            multiple
        >
            Browse Files
        </FileInput>
    );
}

export default UploadFiles;
