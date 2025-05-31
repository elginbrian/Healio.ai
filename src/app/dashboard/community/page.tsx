'use client'
import CommunityHeader from '@/components/claim/header/page'; 
import React, { useState } from 'react';
import { Bell, UserCircle2 } from 'lucide-react'; 

const Community = () => {
    const [activeTab, setActiveTab] = useState('public'); 

    return (
        <div className='bg-[var(--color-w-300)] min-h-screen pb-12'>


            <div className='p-8'>
                <CommunityHeader />
                {/* Kategori Section */}
                <p className='text-xl font-semibold text-gray-800 mb-4'>Kategori</p>
                <div className='flex flex-wrap gap-2 mb-8'>
                    {['Semua', 'Umum', 'Anak', 'Kehamilan', 'Gizi'].map((category) => (
                        <button
                            key={category}
                            className={`px-6 py-2 rounded-full font-medium ${category === 'Semua' 
                                    ? 'bg-[var(--color-p-300)] text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                } transition-colors duration-200`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {/* Ajukan Pertanyaan Section */}
                <div className='bg-white shadow-md rounded-2xl p-6 mb-8 flex items-start space-x-4'>
                    {/* User Avatar */}
                    <UserCircle2 size={40} className='text-gray-400 rounded-full flex-shrink-0' /> {/* Placeholder */}
                    {/* Replace with actual user image if available */}

                    <div className='flex-grow'>
                        <textarea
                            className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-p-300)] mb-4 resize-y'
                            rows={3}
                            placeholder='Ajukan pertanyaan kesehatan Anda Disini...'
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

                <div className='flex border-b border-gray-200 mb-6'>
                    <button
                        className={`px-8 py-3 text-lg font-semibold ${activeTab === 'public'
                                ? 'text-[var(--color-p-300)] border-b-2 border-[var(--color-p-300)]'
                                : 'text-gray-600 hover:text-gray-800'
                            } transition-colors duration-200`}
                        onClick={() => setActiveTab('public')}
                    >
                        Pertanyaan Publik
                    </button>
                    <button
                        className={`px-8 py-3 text-lg font-semibold ${activeTab === 'myQuestions'
                                ? 'text-[var(--color-p-300)] border-b-2 border-[var(--color-p-300)]'
                                : 'text-gray-600 hover:text-gray-800'
                            } transition-colors duration-200`}
                        onClick={() => setActiveTab('myQuestions')}
                    >
                        Pertanyaan Saya
                    </button>
                </div>

                {/* Display Questions based on activeTab */}
                {activeTab === 'public' && (
                    <div className='space-y-6'>
                        {/* Example Public Question */}
                        <div className='bg-white shadow-md rounded-2xl p-6 flex items-start space-x-4'>
                            {/* User Avatar */}
                            <UserCircle2 size={40} className='text-gray-400 rounded-full flex-shrink-0' /> {/* Placeholder */}
                            {/* Replace with actual user image */}
                            <div className='flex-grow'>
                                <div className='flex items-center mb-2'>
                                    <span className='font-semibold text-gray-800 mr-2'>Dian Eka Ratnawati</span>
                                    <span className='text-gray-500 text-sm'>• 2 jam lalu</span>
                                    <span className='ml-3 px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded-full'>Umum</span>
                                </div>
                                <p className='text-gray-700 mb-4'>
                                    Saya mengalami nyeri kepala yang berkepanjangan selama 3 hari. Apakah ini normal? Obat apa yang aman untuk dikonsumsi?
                                </p>
                                <div className='text-right'>
                                    <button className='bg-[var(--color-p-300)] text-white font-semibold py-2 px-6 rounded-full hover:bg-[var(--color-p-400)] transition duration-300'>
                                        Jawab
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'myQuestions' && (
                    <div className='space-y-6'>
                        <p className='text-gray-500 text-center py-12'>Belum ada pertanyaan yang Anda buat.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Community;