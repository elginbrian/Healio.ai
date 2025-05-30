
import React from 'react';

interface TestimonyCardProps {
  quote: string;
  authorName: string;
  authorTitle: string;
  imageSrc: string;
}

const TestimonyCard = ({ quote, authorName, authorTitle, imageSrc }: TestimonyCardProps) => {
  return (
    <div className="w-full rounded-2xl bg-[var(--color-p-300)] p-8 flex items-center justify-center md:px-12">
      <div className="w-full flex items-center">
        <div className="w-full flex flex-col text-white pr-24 flex-grow">
          <div className="inline-block relative"> 
            <p className="text-md mb-4">“{quote}”</p>
            <div className='w-full h-[1px] bg-[var(--color-w-300)]'></div> 
          </div>
          <div className="font-semibold text-3xl mt-4">{authorName}</div>
          <p className="text-md mt-1">{authorTitle}</p>
        </div>
        <div className="flex-shrink-0 ml-auto">
          <img
            src={imageSrc}
            alt={authorName}
            className="w-32 h-32 md:w-48 md:h-48 rounded-2xl object-cover shadow-lg"
          />
        </div>
      </div>
    </div>
  );
}

export default TestimonyCard;