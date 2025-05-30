'use client'
import React from 'react';
import Link from 'next/link'; 

interface NavTextProps {
  text: string;
  href: string; 
  onClick?: () => void;
}

const NavText = ({ text, href, onClick }: NavTextProps) => {
  return (
    <Link href={href}> 
      <p className='mr-8 font-bold text-black hover:text-[var(--color-p-300)] duration-100' onClick={onClick}>
        {text}
      </p>
    </Link>
  );
};

export default NavText;