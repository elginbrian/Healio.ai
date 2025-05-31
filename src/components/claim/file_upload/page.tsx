'use client';

import React, { useRef, useState, useEffect } from 'react';
import { CloudUpload, X } from 'lucide-react';

interface FileUploadInputProps {
  label: string;
  onFileChange: (file: File | null) => void;
  acceptedFileTypes?: string; // e.g., "image/*,application/pdf"
}

const FileUploadInput: React.FC<FileUploadInputProps> = ({
  label,
  onFileChange,
  acceptedFileTypes = 'image/*,application/pdf',
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Notify parent component about file changes
  useEffect(() => {
    onFileChange(selectedFile);
  }, [selectedFile, onFileChange]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleClick = () => {
    if (!selectedFile) { // Only open file dialog if no file is selected
      fileInputRef.current?.click();
    }
  };

  const handleCancelUpload = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); // Prevent the click from bubbling up to the div and opening file dialog
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // Clear the file input
    }
  };

  return (
    <div>
      <p className='text-lg font-semibold text-gray-800 mb-4'>{label}</p>
      <div
        className='w-full h-48 border-2 border-dashed border-[var(--color-p-300)] rounded-xl flex flex-col items-center justify-center text-center p-4 cursor-pointer relative overflow-hidden'
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        {!selectedFile ? (
          <>
            <CloudUpload size={48} className="text-[var(--color-p-300)] mb-4" />
            <p className="text-[var(--color-p-300)] text-lg">
              Seret dan lepas berkas atau klik untuk mengunggah
            </p>
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center relative">
            {selectedFile.type.startsWith('image/') ? (
              <img
                src={URL.createObjectURL(selectedFile)}
                alt={`Preview ${label}`}
                className="w-full h-full object-cover rounded-xl"
              />
            ) : (
              <p className="text-gray-700">
                <strong>Dipilih:</strong> {selectedFile.name}
              </p>
            )}

            <button
              onClick={handleCancelUpload}
              className="absolute top-2 right-2 p-1 rounded-full bg-[var(--color-p-300)] hover:bg-[var(--color-p-400)] focus:outline-none"
              aria-label={`Cancel ${label} Upload`}
            >
              <X size={20} color="white" />
            </button>
          </div>
        )}
        <input
          type="file"
          accept={acceptedFileTypes}
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
};

export default FileUploadInput;