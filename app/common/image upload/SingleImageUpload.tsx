'use client';

import { formatFileSize } from '@edgestore/react/utils';
import { UploadCloudIcon, X } from 'lucide-react';
import * as React from 'react';
import { useDropzone, type DropzoneOptions } from 'react-dropzone';
import styles from './SingleImageUpload.module.css';

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

type InputProps = {
  width: number;
  height: number;
  className?: string;
  value?: File | string;
  onChange?: (file?: File) => void | Promise<void>;
  disabled?: boolean;
  dropzoneOptions?: Omit<DropzoneOptions, 'disabled'>;
};

const SingleImageDropzone = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { dropzoneOptions, width, height, value, className, disabled, onChange },
    ref,
  ) => {
    const imageUrl = React.useMemo(() => {
      if (typeof value === 'string') {
        return value;
      } else if (value) {
        return URL.createObjectURL(value);
      }
      return null;
    }, [value]);

    const {
      getRootProps,
      getInputProps,
      acceptedFiles,
      fileRejections,
      isFocused,
      isDragAccept,
      isDragReject,
    } = useDropzone({
      accept: { 'image/*': [] },
      multiple: false,
      disabled,
      onDrop: (acceptedFiles) => {
        const file = acceptedFiles[0];
        if (file) {
          void onChange?.(file);
        }
      },
      ...dropzoneOptions,
    });

    const dropZoneClassName = [
      styles.dropzone,
      isFocused && styles.dropzoneActive,
      disabled && styles.dropzoneDisabled,
      imageUrl && styles.dropzoneImage,
      isDragReject && styles.dropzoneReject,
      isDragAccept && styles.dropzoneAccept,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    const errorMessage = React.useMemo(() => {
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
      <div>
        <div
          {...getRootProps({
            className: dropZoneClassName,
            style: {
              width,
              height,
            },
          })}
        >
          <input ref={ref} {...getInputProps()} />

          {imageUrl ? (
            <img
              className={styles.imagePreview}
              src={imageUrl}
              alt={acceptedFiles[0]?.name}
            />
          ) : (
            <div className={styles.uploadInfo}>
              <UploadCloudIcon className="mb-2 h-7 w-7" />
              <div>drag & drop to upload</div>
              <div className={styles.uploadButton}>
                <Button type="button" disabled={disabled}>
                  select
                </Button>
              </div>
            </div>
          )}

          {imageUrl && !disabled && (
            <div
              className={styles.removeIconWrapper}
              onClick={(e) => {
                e.stopPropagation();
                void onChange?.(undefined);
              }}
            >
              <div className={styles.removeIcon}>
                <X width={16} height={16} />
              </div>
            </div>
          )}
        </div>

        <div className="mt-1 text-xs text-red-500">{errorMessage}</div>
      </div>
    );
  },
);
SingleImageDropzone.displayName = 'SingleImageDropzone';

const Button = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => {
  return (
    <button className={className} ref={ref} {...props} />
  );
});
Button.displayName = 'Button';

export { SingleImageDropzone };
