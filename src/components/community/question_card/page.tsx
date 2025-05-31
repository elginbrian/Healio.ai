'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface Answer {
    doctorName: string;
    doctorAvatar: string;
    answerTimeAgo: string;
    excerpt: string; 
    fullAnswer: string; 
}

interface Question {
    id: string;
    userName: string;
    userAvatar: string;
    timeAgo: string;
    category: string;
    isAnswered: boolean;
    title: string;
    excerpt: string;
    fullQuestion?: string;
    answer: Answer | null;
}

interface QuestionCardProps {
    question: Question;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question }) => {
    const router = useRouter();
    const [showAnswerPopup, setShowAnswerPopup] = useState(false);
    const [answerText, setAnswerText] = useState('');

    const handleCardClick = () => {
        router.push(`/dashboard/community/question/${question.id}`);
    };

    const handleAnswerClick = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent card click when answer button is clicked
        setShowAnswerPopup(true);
    };

    const handleClosePopup = () => {
        setShowAnswerPopup(false);
        setAnswerText('');
    };

    const handleSubmitAnswer = () => {
        // Here you would typically handle the answer submission
        console.log('Answer submitted:', answerText);
        handleClosePopup();
    };

    return (
        <>
            <div
                className='bg-white shadow-md rounded-2xl p-6 flex flex-col cursor-pointer hover:shadow-lg transition-shadow duration-200'
                onClick={handleCardClick}
            >
                <div className='flex items-start space-x-4 mb-4'>
                    <div className="w-10 h-10 bg-gray-300 rounded-full overflow-hidden flex items-center justify-center text-gray-700 text-lg font-bold flex-shrink-0">
                        <Image src={'/img/hospital_dummy.png'} alt="User" width={40} height={40} className="w-full h-full object-cover rounded-full" />
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
                        <div className='flex justify-between items-start'>
                            <p className='text-gray-700 w-2/3'>
                                {question.excerpt}
                            </p>
                            {!question.isAnswered && (
                                <button 
                                    onClick={handleAnswerClick}
                                    className='bg-[var(--color-p-300)] text-white font-semibold px-6 py-2 rounded-full hover:bg-[var(--color-p-400)] transition duration-300 self-start'
                                >
                                    Jawab
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {question.answer && (
                    <div className='bg-[#FFEBF4] rounded-xl p-4 ml-12 flex items-start space-x-4'>
                        <div className='relative w-10 h-10 flex-shrink-0'>
                            <div className="w-10 h-10 bg-gray-300 rounded-full overflow-hidden flex items-center justify-center text-gray-700 text-lg font-bold flex-shrink-0">
                                <Image src={'/img/hospital_dummy.png'} alt="User" width={40} height={40} className="w-full h-full object-cover rounded-full" />
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
                            <p className='text-gray-700'>
                                {question.answer.excerpt}
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Answer Popup Modal */}
            {showAnswerPopup && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div 
                        className="absolute inset-0 bg-black/10 backdrop-blur-sm"
                        onClick={handleClosePopup}
                    ></div>
                    
                    <div className="relative bg-white rounded-3xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto shadow-2xl">
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Jawab Pertanyaan</h2>
                            
                            <div className="mb-4">
                                <h3 className="font-semibold text-gray-800 mb-2">Pertanyaan</h3>
                                <p className="text-lg font-semibold text-gray-800 mb-2">{question.title}</p>
                                <p className="text-gray-700 leading-relaxed">
                                    {question.fullQuestion || question.excerpt}
                                </p>
                            </div>
                        </div>

                        <div className="mb-6">
                            <label htmlFor="answer" className="block text-lg font-semibold text-gray-800 mb-3">
                                Jawaban
                            </label>
                            <textarea
                                id="answer"
                                value={answerText}
                                onChange={(e) => setAnswerText(e.target.value)}
                                placeholder="Tuliskan jawaban Anda disini..."
                                className="w-full h-40 p-4 border border-gray-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent text-gray-700"
                            />
                        </div>

                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={handleClosePopup}
                                className="px-8 py-3 border border-gray-300 text-gray-700 font-semibold rounded-full hover:bg-gray-50 transition duration-300"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleSubmitAnswer}
                                className="px-8 py-3 bg-gradient-to-r from-pink-500 to-pink-600 text-white font-semibold rounded-full hover:from-pink-600 hover:to-pink-700 transition duration-300 shadow-lg"
                            >
                                Jawab
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default QuestionCard;