'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import CommunityHeader from '@/components/community/community_header/page';
import Image from 'next/image';

// Define the type for a question object
interface Answer {
    doctorName: string;
    doctorAvatar: string;
    answerTimeAgo: string;
    fullAnswer: string;
}

interface Question {
    id: string;
    userName: string;
    userAvatar: string; // Explicitly define this property
    timeAgo: string;
    category: string;
    isAnswered: boolean;
    title: string;
    fullQuestion: string;
    answer: Answer | null;
}

const QuestionDetail = () => {
    const { id } = useParams();
    const router = useRouter();
    // Initialize useState with null or a default empty object that matches the Question interface
    const [question, setQuestion] = useState<Question | null>(null);

    useEffect(() => {
        const allQuestions: Question[] = [ // Explicitly type the array
            {
                id: '1',
                userName: 'D**n',
                userAvatar: '/img/hospital_dummy.png', // Changed to /img/hospital_dummy.png
                timeAgo: '2 jam lalu',
                category: 'Umum',
                isAnswered: true,
                title: 'Nyeri Kepala Berkepanjangan Selama 3 Hari, Apakah Normal?',
                fullQuestion: 'Saya mengalami nyeri kepala yang berkepanjangan selama tiga hari berturut-turut. Rasa sakitnya tidak terlalu tajam, tetapi cukup mengganggu aktivitas harian saya, terutama saat bekerja di depan layar dalam waktu lama. Saya sudah mencoba mengurangi penggunaan gadget, tidur lebih awal, dan minum air putih yang cukup, tetapi kondisinya masih belum membaik. Saya ingin tahu, apakah ini kondisi yang masih tergolong normal, ataukah ada kemungkinan indikasi masalah kesehatan lain yang perlu saya waspadai? Juga, obat apa yang aman dikonsumsi untuk mengurangi nyeri ini, jika sewaktu-waktu kambuh kembali?',
                answer: {
                    doctorName: 'Rizqi Al-Madinah S.Kep',
                    doctorAvatar: '/img/hospital_dummy.png', // Changed to /img/hospital_dummy.png
                    answerTimeAgo: '2 jam lalu',
                    fullAnswer: 'Halo Selamat Siang, nyeri kepala yang berlangsung 3 hari tanpa perbaikan adalah gejala yang tidak boleh diabaikan, meskipun nyerinya tidak terasa tajam. Terutama jika disertai faktor pemicu seperti paparan layar berlebih, postur tubuh saat duduk, atau stres. Ini bisa jadi jenis tension-type headache atau migrain ringan. Sebagai langkah awal, Anda bisa mengonsumsi paracetamol 500mg setiap 6–8 jam jika diperlukan, maksimal 3 kali sehari. Pastikan Anda cukup istirahat, hindari paparan layar terlalu lama, dan jaga hidrasi tubuh. Namun, jika keluhan tidak membaik dalam 24 jam ke depan, atau jika muncul gejala tambahan seperti mual, muntah, penglihatan kabur, atau kelemahan anggota tubuh, segera periksakan diri ke dokter. Pemeriksaan langsung sangat penting untuk menyingkirkan kemungkinan gangguan neurologis yang lebih serius. Semoga lekas membaik, dan jangan ragu untuk kembali bertanya bila ada gejala lanjutan.'
                }
            },
            {
                id: '2',
                userName: 'G**y',
                userAvatar: '/img/hospital_dummy.png', // Changed to /img/hospital_dummy.png
                timeAgo: '1 hari lalu',
                category: 'Gizi',
                isAnswered: false,
                title: 'Anak Susah Makan Sayur, Bagaimana Cara Mengatasinya?',
                fullQuestion: 'Anak saya berusia 4 tahun dan sangat sulit sekali makan sayur. Setiap kali disajikan, dia selalu menolak atau hanya memakannya sedikit. Saya khawatir asupan nutrisinya kurang karena ini. Adakah tips atau trik khusus untuk membuat anak saya mau makan sayur?',
                answer: null
            },
            {
                id: '3',
                userName: 'S**a',
                userAvatar: '/img/hospital_dummy.png',
                timeAgo: '3 jam lalu',
                category: 'Kehamilan',
                isAnswered: true,
                title: 'Mual dan Muntah di Trimester Pertama, Normal Kah?',
                fullQuestion: 'Saya sedang hamil 8 minggu dan mengalami mual muntah yang cukup parah setiap pagi. Bahkan kadang siang hari juga masih mual. Apakah ini normal? Dan bagaimana cara mengatasinya supaya tidak mengganggu aktivitas?',
                answer: {
                    doctorName: 'Dr. Maria Sari, Sp.OG',
                    doctorAvatar: '/img/hospital_dummy.png', // Changed to /img/hospital_dummy.png
                    answerTimeAgo: '2 jam lalu',
                    fullAnswer: 'Selamat atas kehamilannya! Morning sickness atau mual muntah di trimester pertama adalah hal yang sangat normal dan dialami sekitar 70-80% ibu hamil. Ini disebabkan oleh perubahan hormon HCG yang meningkat pesat. Beberapa tips yang bisa membantu: 1) Makan dalam porsi kecil tapi sering, 2) Hindari makanan berlemak dan berbau menyengat, 3) Konsumsi makanan kering seperti biskuit di pagi hari sebelum bangun tidur, 4) Minum air putih yang cukup untuk mencegah dehidrasi, 5) Istirahat yang cukup. Jika muntah sangat sering (lebih dari 3x sehari) dan tidak bisa makan sama sekali, segera konsultasi ke dokter kandungan untuk pemeriksaan lebih lanjut.'
                }
            }
        ];

        const foundQuestion = allQuestions.find(q => q.id === id);
        setQuestion(foundQuestion || null); // Ensure it's null if not found
    }, [id]);

    if (!question) {
        return (
            <div className='bg-[var(--color-w-300)] min-h-screen flex items-center justify-center'>
                <p>Loading question details...</p>
            </div>
        );
    }

    const relatedQuestions: Question[] = [ // Explicitly type the array
        { id: '4', userName: 'R**i', userAvatar: '/img/hospital_dummy.png', timeAgo: '5 jam lalu', category: 'Anak', isAnswered: true, title: 'Demam Tinggi pada Balita, Kapan Harus ke Dokter?', fullQuestion: '', answer: null },
        { id: '5', userName: 'L**a', userAvatar: '/img/hospital_dummy.png', timeAgo: '6 jam lalu', category: 'Umum', isAnswered: false, title: 'Susah Tidur dan Sering Terbangun Malam Hari', fullQuestion: '', answer: null },
        { id: '6', userName: 'F**r', userAvatar: '/img/hospital_dummy.png', timeAgo: '8 jam lalu', category: 'Gizi', isAnswered: true, title: 'Diet Sehat untuk Menurunkan Kolesterol', fullQuestion: '', answer: null },
    ];

    return (
        <div className='bg-[var(--color-w-300)] min-h-screen pb-12'>
            <div className='p-8'>
                <CommunityHeader />

                <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
                    <div className='md:col-span-2'>
                        {/* Main Question Detail */}
                        <div className='bg-white shadow-md rounded-2xl p-6 mb-8'>
                            <p className='text-xl font-semibold text-gray-800 mb-4'>Tanya Nakes</p>
                            <div className='flex items-start space-x-4 mb-4'>
                                <div className="w-10 h-10 bg-gray-300 rounded-full overflow-hidden flex items-center justify-center text-gray-700 text-lg font-bold flex-shrink-0">
                                    {/* Ensured question.userAvatar is used directly */}
                                    <Image src={question.userAvatar} alt="User" width={40} height={40} className="w-full h-full object-cover rounded-full" />
                                </div>
                                <div className='flex-grow'>
                                    <div className='flex items-center mb-2'>
                                        <span className='font-semibold text-gray-800 mr-2'>Oleh: {question.userName}</span>
                                        <span className='text-gray-500 text-sm'>• {question.timeAgo}</span>
                                        <span className='ml-3 px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded-full'>{question.category}</span>
                                        {question.isAnswered && (
                                            <span className='ml-auto text-green-600 font-semibold text-sm'>Terjawab</span>
                                        )}
                                    </div>
                                    <p className='font-semibold text-gray-800 mb-2'>{question.title}</p>
                                    <p className='text-gray-700 whitespace-pre-wrap'>{question.fullQuestion}</p>
                                </div>
                            </div>
                        </div>

                        {/* Answer Section */}
                        {question.answer && (
                            <div className='bg-white shadow-md rounded-2xl p-6'>
                                <p className='text-xl font-semibold text-gray-800 mb-4'>Dijawab Oleh:</p>
                                <div className='bg-[#FFEBF4] rounded-xl p-4 flex items-start space-x-4'>
                                    <div className='relative w-10 h-10 flex-shrink-0'>
                                        <div className="w-10 h-10 bg-gray-300 rounded-full overflow-hidden flex items-center justify-center text-gray-700 text-lg font-bold flex-shrink-0">
                                            <Image
                                                src={question.answer.doctorAvatar} // Ensured this is always a string by typing `Answer`
                                                alt={question.answer.doctorName}
                                                width={40}
                                                height={40}
                                                className='h-full  object-cover'
                                            />
                                        </div>
                                        <div className='absolute bottom-0 right-0 bg-green-500 rounded-full p-0.5'>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className='flex-grow'>
                                        <div className='flex items-center mb-1'>
                                            <span className='font-semibold text-gray-800 mr-2'>{question.answer.doctorName}</span>
                                            <span className='text-gray-500 text-sm'>• {question.answer.answerTimeAgo}</span>
                                        </div>
                                        <p className='text-gray-700 whitespace-pre-wrap'>{question.answer.fullAnswer}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                        {!question.answer && (
                            <div className='bg-white shadow-md rounded-2xl p-6 text-center text-gray-500'>
                                <p>Pertanyaan ini belum dijawab.</p>
                            </div>
                        )}
                    </div>
                    <div className='md:col-span-1'>
                        <div className='bg-white shadow-md rounded-2xl p-6'>
                            <p className='text-xl font-semibold text-gray-800 mb-4'>Diskusi Terkait</p>
                            {relatedQuestions.filter(relatedQ => relatedQ.id !== id).map(relatedQ => (
                                <div key={relatedQ.id} className='mb-4 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50' onClick={() => router.push(`/community/questions/${relatedQ.id}`)}>
                                    <div className='flex items-center mb-2'>
                                        <div className="w-8 h-8 bg-gray-300 rounded-full overflow-hidden flex items-center justify-center text-gray-700 text-sm font-bold flex-shrink-0 mr-2">

                                            <Image src={relatedQ.userAvatar} alt="User" width={32} height={32} className="w-full h-full object-cover rounded-full" />
                                        </div>
                                        <span className='font-semibold text-gray-800 text-sm'>{relatedQ.title}</span>
                                    </div>
                                    <div className='flex items-center text-gray-500 text-sm'>
                                        <span className='mr-2'>{relatedQ.timeAgo}</span>
                                        <span className='px-2 py-0.5 bg-gray-200 text-gray-700 text-xs rounded-full'>{relatedQ.category}</span>
                                        {relatedQ.isAnswered && (
                                            <span className='ml-auto text-green-600 font-semibold text-sm'>Terjawab</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuestionDetail;