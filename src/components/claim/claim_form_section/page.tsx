import React from 'react';

interface ClaimFormSectionProps {
  title: string;
  children: React.ReactNode;
}

const ClaimFormSection: React.FC<ClaimFormSectionProps> = ({ title, children }) => {
  return (
    <div>
      <p className='text-lg font-semibold text-gray-800 mb-4'>{title}</p>
      {children}
    </div>
  );
};

export default ClaimFormSection;