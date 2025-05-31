'use client';

import { X } from 'lucide-react';
import { CloudUpload } from 'lucide-react';
import React, { useRef, useState } from 'react';

const UploadReceipt = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [scanResult, setScanResult] = useState<any>(null); // State to store scan results
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setScanResult(null); // Clear previous scan results when a new file is selected
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setSelectedFile(file);
      setScanResult(null); // Clear previous scan results on drop
    }
  };

  const handleUploadClick = () => {
    if (!selectedFile) {
      fileInputRef.current?.click();
    }
  };

  const handleCancelUpload = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setSelectedFile(null);
    setScanResult(null); // Clear scan results when upload is canceled
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleScan = () => {
    if (selectedFile) {
      // Simulate API call or processing here
      // For demonstration, we'll use static data from your image
      const simulatedScanResult = {
        items: [
          { name: 'Paracetamol 500mg', price: 'Rp10.000' },
          { name: 'Amoxicillin 250mg', price: 'Rp15.000' },
          { name: 'Ibuprofen 200mg', price: 'Rp12.000' },
        ],
        total: 'Rp37.000',
        time: '22 May 2025, 12:53',
        location: 'Apotek Sehat',
      };
      setScanResult(simulatedScanResult);
      alert(`Berkas "${selectedFile.name}" telah diproses!`);
    }
  };

  return (
    <div className='mb-8'>
      <p className='text-[var(--color-p-300)] font-semibold text-xl mb-4'>Unggah Struk</p>
      <div className='w-full shadow-md rounded-2xl bg-white p-6'>
        <div
          className='w-full h-80 border-2 border-dashed border-[var(--color-p-300)] rounded-xl flex flex-col items-center justify-center text-center p-4 cursor-pointer relative overflow-hidden'
          onClick={handleUploadClick}
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
                  alt="Preview"
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
                aria-label="Cancel Upload"
              >
                <X size={20} color="white" />
              </button>
            </div>
          )}

          <input
            type="file"
            accept="image/*,application/pdf"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileChange}
          />
        </div>

        <button
          className='mt-6 w-full py-3 bg-[var(--color-p-300)] text-white font-semibold rounded-full disabled:opacity-50'
          disabled={!selectedFile || !!scanResult} // Disable if no file or already scanned
          onClick={handleScan} // Call handleScan when the button is clicked
        >
          Scan
        </button>

        {scanResult && (
          <div className="mt-8">
            <p className='text-[var(--color-p-300)] font-semibold text-xl mb-4'>Hasil Scan</p>
            <div className='w-full shadow-md rounded-2xl bg-white p-6'>
              <div className="space-y-3">
                {scanResult.items.map((item: any, index: number) => (
                  <div key={index} className="flex justify-between items-center text-gray-700">
                    <span>{item.name}</span>
                    <span className="font-semibold">{item.price}</span>
                  </div>
                ))}
                <div className="border-t border-gray-200 pt-3 mt-3 flex justify-between items-center text-gray-800 font-bold">
                  <span>Total</span>
                  <span>{scanResult.total}</span>
                </div>
                <div className="flex justify-between items-center text-gray-600 text-sm mt-2">
                  <span>Waktu</span>
                  <span>{scanResult.time}</span>
                </div>
                <div className="flex justify-between items-center text-gray-600 text-sm">
                  <span>Tempat</span>
                  <span>{scanResult.location}</span>
                </div>
              </div>
              <button className="mt-6 w-full py-3 bg-[var(--color-p-300)] text-white font-semibold rounded-full">
                Tambah ke Pengeluaran
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadReceipt;