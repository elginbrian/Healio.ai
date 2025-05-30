// components/facility_card/page.jsx (atau FacilityCard.jsx)
'use client'

import React from 'react';
import { Star } from 'lucide-react'; // Import ikon bintang

interface FacilityCardProps {
  imageSrc: string;
  name: string;
  address: string;
  isOpen: boolean; 
  closeTime?: string; 
  distance: string; 
  rating: number; 
  reviewCount: number;
  serviceType: string; 
  priceRange: string;
}

const FacilityCard = ({
  imageSrc,
  name,
  address,
  isOpen,
  closeTime,
  distance,
  rating,
  reviewCount,
  serviceType,
  priceRange,
}: FacilityCardProps) => {
  const renderStars = (currentRating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          size={16}
          fill={currentRating >= i ? '#FFD700' : '#d1d5db'} // Emas untuk terisi, abu-abu untuk kosong
          stroke={currentRating >= i ? '#FFD700' : '#d1d5db'} // Stroke yang sama dengan fill
        />
      );
    }
    return stars;
  };

  return (
    <div className='w-96 rounded-2xl shadow-lg bg-white overflow-hidden'> {/* Ganti shadow-md jadi shadow-lg, tambah bg-white */}
      <div className='relative w-full h-40'>
        <img src={imageSrc} className='w-full h-full object-cover rounded-t-2xl' alt={name} />
        {/* Label Rawat Inap */}
        <div className='absolute top-4 right-4 bg-[var(--color-p-300)] text-white text-sm font-semibold px-3 py-1 rounded-full'>
          {serviceType}
        </div>
        {/* Label Harga */}
        <div className='absolute bottom-4 right-4 bg-[var(--color-p-300)] text-white text-sm font-semibold px-3 py-1 rounded-full'>
          {priceRange}
        </div>
      </div>

      <div className='p-4'>
        <p className='text-xl font-semibold text-gray-900 mb-1'>{name}</p>
        <p className='text-sm text-gray-600 mb-2'>{address}</p>

        <div className='flex items-center text-sm text-gray-600 mb-2'>
          <span className={isOpen ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
            {isOpen ? 'Buka' : 'Tutup'}
          </span>
          {closeTime && <span className='mx-1'>&bull;</span>}
          {closeTime && <span>{closeTime}</span>}
          <span className='mx-1'>&bull;</span>
          <span>{distance}</span>
        </div>

        <div className='flex items-center'>
          <span className='text-gray-900 font-semibold mr-1'>{rating.toFixed(1)}</span>
          <div className='flex mr-2'>
            {renderStars(rating)}
          </div>
          <span className='text-gray-600'>({reviewCount})</span>
        </div>
      </div>
    </div>
  );
};

export default FacilityCard;