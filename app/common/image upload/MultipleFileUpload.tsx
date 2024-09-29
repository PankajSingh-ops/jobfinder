// MultiFileDropzone.tsx

'use client';

import React, { useMemo, useState, forwardRef } from 'react';
import { useDropzone, type DropzoneOptions } from 'react-dropzone';
import { CheckCircleIcon, FileIcon, LucideFileWarning, Trash2Icon, UploadCloudIcon, XIcon } from 'lucide-react';
import { formatFileSize } from '@edgestore/react/utils';
import styles from './MultipleFileUploads.module.css';

export type FileState = {
  file: File;
  key: string;
  progress: 'PENDING' | 'COMPLETE' | 'ERROR' | number;
  abortController?: AbortController;
};

type InputProps = {
  className?: string;
  value?: FileState[];
  onChange?: (files: FileState[]) => void | Promise<void>;
  onFilesAdded?: (addedFiles: FileState[]) => void | Promise<void>;
  disabled?: boolean;
  dropzoneOptions?: Omit<DropzoneOptions, 'disabled'>;
};

const ERROR_MESSAGES = {
  fileTooLarge(maxSize: number) {
    return `The file is too large. Max size is ${formatFileSize(maxSize)}.`;
  },
  fileInvalidType() {
    return 'Invalid file type.';
  },
  tooManyFiles(maxFiles: number) {
    return `You can only add ${maxFiles} file(s).`;
  },
  fileNotSupported() {
    return 'The file is not supported.';
  },
};

const MultiFileDropzone = forwardRef<HTMLInputElement, InputProps>(
  ({ dropzoneOptions, value, className, disabled, onFilesAdded, onChange }, ref) => {
    const [customError, setCustomError] = useState<string>();

    if (dropzoneOptions?.maxFiles && value?.length) {
      disabled = disabled ?? value.length >= dropzoneOptions.maxFiles;
    }

    const { getRootProps, getInputProps, fileRejections, isFocused, isDragAccept, isDragReject } = useDropzone({
      disabled,
      onDrop: (acceptedFiles) => {
        const files = acceptedFiles;
        setCustomError(undefined);
        if (dropzoneOptions?.maxFiles && (value?.length ?? 0) + files.length > dropzoneOptions.maxFiles) {
          setCustomError(ERROR_MESSAGES.tooManyFiles(dropzoneOptions.maxFiles));
          return;
        }
        if (files) {
          const addedFiles = files.map<FileState>((file) => ({
            file,
            key: Math.random().toString(36).slice(2),
            progress: 'PENDING',
          }));
          void onFilesAdded?.(addedFiles);
          void onChange?.([...(value ?? []), ...addedFiles]);
        }
      },
      ...dropzoneOptions,
    });

    const dropZoneClassName = useMemo(() => {
      let baseClass = styles.base;
      if (isFocused) baseClass += ` ${styles.active}`;
      if (disabled) baseClass += ` ${styles.disabled}`;
      if (isDragReject || fileRejections[0]) baseClass += ` ${styles.reject}`;
      if (isDragAccept) baseClass += ` ${styles.accept}`;
      return `${baseClass} ${className || ''}`.trim();
    }, [isFocused, fileRejections, isDragAccept, isDragReject, disabled, className]);

    const errorMessage = useMemo(() => {
      if (fileRejections[0]) {
        const { errors } = fileRejections[0];
        if (errors[0]?.code === 'file-too-large') {
          return ERROR_MESSAGES.fileTooLarge(dropzoneOptions?.maxSize ?? 0);
        } else if (errors[0]?.code === 'file-invalid-type') {
          return ERROR_MESSAGES.fileInvalidType();
        } else if (errors[0]?.code === 'too-many-files') {
          return ERROR_MESSAGES.tooManyFiles(dropzoneOptions?.maxFiles ?? 0);
        } else {
          return ERROR_MESSAGES.fileNotSupported();
        }
      }
      return undefined;
    }, [fileRejections, dropzoneOptions]);

    return (
      <div className={styles.fileListContainer}>
        <div {...getRootProps({ className: dropZoneClassName })}>
          <input ref={ref} {...getInputProps()} />
          <div className={styles.dropzoneText}>
            <UploadCloudIcon className="mb-1 h-7 w-7" />
            drag & drop or click to upload
          </div>
        </div>

        <div className="mt-1 text-xs text-red-500">{customError ?? errorMessage}</div>

        {value?.map(({ file, abortController, progress }, i) => (
          <div key={i} className={styles.fileListItem}>
            <FileIcon size="30" />
            <div className={styles.fileInfo}>
              <div className={styles.fileName}>{file.name}</div>
              <div className={styles.fileSize}>{formatFileSize(file.size)}</div>
            </div>
            <div className={styles.trashButton}>
              {progress === 'PENDING' ? (
                <button
                  type="button"
                  onClick={() => {
                    void onChange?.(value.filter((_, index) => index !== i));
                  }}
                >
                  <Trash2Icon />
                </button>
              ) : progress === 'ERROR' ? (
                <LucideFileWarning className="text-red-600" />
              ) : progress !== 'COMPLETE' ? (
                <div className="flex flex-col items-end gap-0.5">
                  {abortController && (
                    <button
                      type="button"
                      disabled={progress === 100}
                      onClick={() => {
                        abortController.abort();
                      }}
                    >
                      <XIcon className="text-gray-400" />
                    </button>
                  )}
                  <div>{Math.round(progress)}%</div>
                </div>
              ) : (
                <CheckCircleIcon className="text-green-600" />
              )}
            </div>

            {typeof progress === 'number' && (
              <div className={styles.progressBarContainer}>
                <div
                  className={styles.progressBar}
                  style={{ width: progress ? `${progress}%` : '0%' }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    );
  },
);

MultiFileDropzone.displayName = 'MultiFileDropzone';

export { MultiFileDropzone };
