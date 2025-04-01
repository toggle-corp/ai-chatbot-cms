export enum ErrorType {
    maxFileSizeExceeded = 'MAX_FILE_SIZE_EXCEEDED',
    invalidFileType = 'INVALID_FILE_TYPE',
}

export type ValidityStatus = {
    isValid: true;
} | {
    isValid: false;
    errorType: ErrorType;
}

export default function isValidFile(
    file: File,
    maxFileSize: number,
    acceptString?: string,
): ValidityStatus {
    if (file.size > (maxFileSize * 1024 * 1024)) {
        return { isValid: false, errorType: ErrorType.maxFileSizeExceeded };
    }
    // if there is no accept string, anything is valid
    if (!acceptString) {
        return { isValid: true };
    }
    const extensionMatch = /\.\w+$/.exec(file.name);
    const mimeMatch = /^.+\//.exec(file.type);

    const fileTypeList = acceptString.split(/,\s+/);
    const isFileValid = fileTypeList.some((fileType) => {
        // check mimeType such as image/png or image/*
        if (file.type === fileType || (!!mimeMatch && `${mimeMatch[0]}*` === fileType)) {
            return { isValid: true };
        }
        return !!extensionMatch && extensionMatch[0].toLowerCase() === fileType.toLowerCase();
    });
    if (!isFileValid) {
        return { isValid: false, errorType: ErrorType.invalidFileType };
    }
    return { isValid: true };
}
