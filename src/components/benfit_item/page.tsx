
import React from 'react';

interface BenefitItemProps {
  imageSrc: string;
  title: string;    
  description: string; 
}

const BenefitItem = ({ imageSrc, title, description }: BenefitItemProps) => {
  return (
    <div className='flex flex-col items-center w-80 mx-12'>
        <div className='h-16 mb-5 flex items-center justify-center'>
            <img src={imageSrc} alt={title} /> 
        </div>
      <p className='text-3xl font-medium text-black mt-5'>{title}</p>
      <p className='text-md text-black text-center mt-3'>{description}</p> 
    </div>
  );
}

export default BenefitItem;