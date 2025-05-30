'use client';

import { CloudUpload } from 'lucide-react';
import React, { useRef, useState } from 'react';

const UploadReceipt = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className='mb-8'>
      <p className='text-[var(--color-p-300)] font-semibold text-xl mb-4'>Unggah Struk</p>
      <div className='w-full shadow-md rounded-2xl bg-white p-6'>
        <div
          className='w-full h-80 border-2 border-dashed border-[var(--color-p-300)] rounded-xl flex flex-col items-center justify-center text-center p-4 cursor-pointer'
          onClick={handleUploadClick}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          <CloudUpload size={48} className="text-[var(--color-p-300)] mb-4" />
          <p className="text-[var(--color-p-300)] text-lg">
            Seret dan lepas berkas atau klik untuk mengunggah
          </p>

          <input
            type="file"
            accept="image/*,application/pdf"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileChange}
          />

          {selectedFile && (
            <div className="mt-4 text-sm text-gray-700">
              <strong>Dipilih:</strong> {selectedFile.name}
              {selectedFile.type.startsWith('image/') && (
                <div className="mt-2 max-h-40 overflow-hidden rounded-lg border">
                  <img
                    src={URL.createObjectURL(selectedFile)}
                    alt="Preview"
                    className="w-auto h-40 object-contain mx-auto"
                  />
                </div>
              )}
            </div>
          )}
        </div>

        <button
          className='mt-6 w-full py-3 bg-[var(--color-p-300)] text-white font-semibold rounded-full disabled:opacity-50'
          disabled={!selectedFile}
          onClick={() => {
            // Logika upload bisa dimasukkan di sini
            alert(`Berkas "${selectedFile?.name}" siap diunggah!`);
          }}
        >
          Scan
        </button>
      </div>
    </div>
  );
};

export default UploadReceipt;
