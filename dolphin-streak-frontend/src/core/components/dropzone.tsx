import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { cn } from '@/lib/utils';
import { ImageIcon } from 'lucide-react';

interface DropzoneProps {
  onFileAccepted: (file: File) => void;
  className?: string;
  disabled?: boolean;
}

export const Dropzone = ({ onFileAccepted, className, disabled }: DropzoneProps) => {
  const [isDragging, setIsDragging] = useState(false);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onFileAccepted(acceptedFiles[0]);
      }
      setIsDragging(false);
    },
    [onFileAccepted]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.png', '.jpg', '.webp'],
    },
    disabled,
    onDragEnter: () => setIsDragging(true),
    onDragLeave: () => setIsDragging(false),
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        'relative flex items-center justify-center rounded-md border-2 border-dashed border-gray-300 bg-gray-50 px-4 py-6 text-center dark:border-gray-700 dark:bg-gray-800',
        isDragActive && 'border-primary-500 dark:border-primary-400',
        disabled && 'cursor-not-allowed opacity-50',
        className
      )}
    >
      <input {...getInputProps()} />
      <div className="space-y-2">
        <ImageIcon className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {isDragging
            ? 'Drop the image here...'
            : 'Drag and drop an image here, or click to select a file'}
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-500">
          PNG, JPG, JPEG, WEBP up to 5MB
        </p>
      </div>
    </div>
  );
};
