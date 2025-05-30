// components/pool_card/page.jsx (No changes, included for completeness)
'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react'; 

interface PoolCardProps {
  icon: LucideIcon; 
  title: string;
  description: string;
  buttonText: string;
  onClick: () => void; 
}

const PoolCard = ({ icon: Icon, title, description, buttonText, onClick }: PoolCardProps) => {
  return (
    <div className="flex-1 bg-[var(--color-p-300)] rounded-3xl p-8 flex flex-col items-center text-center shadow-lg">
      <div className="text-white mb-6">
        <Icon size={64} strokeWidth={1.5} />
      </div>
      <h2 className="text-3xl font-bold text-white mb-4">
        {title}
      </h2>
      <div className='h-24 flex items-center justify-center flex items-start'>
        <p className="text-white text-md max-w-sm">
          {description}
        </p>
      </div>
      <button
        onClick={onClick}
        className="bg-white text-[var(--color-p-300)] font-semibold py-3 px-8 rounded-full hover:bg-[var(--color-w-100)] transition duration-300 mt-auto"
      >
        {buttonText}
      </button>
    </div>
  );
};

export default PoolCard;
