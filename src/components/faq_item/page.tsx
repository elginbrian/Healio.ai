'use client'

import React, { useState, useRef } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FAQItem = () => {
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => setIsOpen(!isOpen);

  return (
    <div className="mx-6 md:mx-72 p-4 md:p-8 flex flex-col shadow-md rounded-2xl mb-8 transition-all duration-300">
      <div
        className="flex justify-between items-center mb-2 cursor-pointer"
        onClick={toggleDropdown}
      >
        <p className="text-black text-lg md:text-xl font-medium">
          Bagaimana Healio.ai merekomendasikan fasilitas kesehatan?
        </p>
        <div className="text-[var(--color-p-300)]">
          {isOpen ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
        </div>
      </div>

      <div
        ref={contentRef}
        className={`transition-all duration-500 ease-in-out overflow-hidden`}
        style={{
          maxHeight: isOpen ? contentRef.current?.scrollHeight : 0,
        }}
      >
        <p className="text-justify text-md mt-4 text-black">
          Healio.ai menggunakan kecerdasan buatan untuk menganalisis profil pengguna, seperti usia, kondisi kesehatan, anggaran, dan preferensi dokter. Sistem mengambil data tarif dan rating dari sumber seperti Google Reviews dan JKN Care, lalu merekomendasikan fasilitas kesehatan yang paling sesuai, dengan opsi filter berdasarkan jarak atau jenis fasilitas.
        </p>
      </div>
    </div>
  );
};

export default FAQItem;
