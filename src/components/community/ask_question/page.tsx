'use client';
import React from 'react';
import { UserCircle2 } from 'lucide-react';

const AskQuestionSection = () => {
    return (
        <div className='bg-white shadow-md rounded-2xl p-6 mb-8 flex flex-col space-y-4'>
            <div className='flex items-start space-x-4'>
                <div className="w-10 h-10 bg-gray-300 rounded-full overflow-hidden flex items-center justify-center text-gray-700 text-lg font-bold flex-shrink-0">
                    <img src={'/img/hospital_dummy.png'} alt="User" width={40} height={40} className="w-full h-full object-cover rounded-full" />
                </div>
                <div className='flex-grow'>
                    <input
                        type='text'
                        className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-p-300)] mb-4'
                        placeholder='Judul Pertanyaan'
                    />
                    <textarea
                        className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-p-300)] mb-4 resize-y'
                        rows={3}
                        placeholder='Deskripsi lengkap pertanyaan'
                    ></textarea>
                    <div className='flex items-center justify-between'>
                        <select className='p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-p-300)]'>
                            <option>Pilih Kategori</option>
                            <option>Umum</option>
                            <option>Anak</option>
                            <option>Kehamilan</option>
                            <option>Gizi</option>
                        </select>
                        <button className='bg-[var(--color-p-300)] text-white font-semibold py-3 px-6 rounded-full hover:bg-[var(--color-p-400)] transition duration-300'>
                            Kirim Pertanyaan
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AskQuestionSection;