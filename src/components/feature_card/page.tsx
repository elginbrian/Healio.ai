
import React from 'react';

interface FeatureCardProps {
  imageSrc: string;
  title: string;   
  description: string;
}

const FeatureCard = ({ imageSrc, title, description }: FeatureCardProps) => {
  return (
    <div className='w-80 h-80 bg-[var(--color-p-300)] rounded-2xl p-5 mx-4'>
      <img src={imageSrc} className='w-12' alt={title} /> 
      <div className='h-16 mb-5'>
        <p className='text-3xl font-medium text-[var(--color-w-300)] mt-5'>{title}</p>
      </div>
      <p className='text-md text-[var(--color-w-300)] text-justify mt-3'>{description}</p> 
    </div>
  );
};

export default FeatureCard;