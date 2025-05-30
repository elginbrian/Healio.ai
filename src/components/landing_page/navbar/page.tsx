import React from 'react';
import ButtonPink from '@/components/button_pink/page';
import ButtonWhite from '@/components/button_white/page';
import NavText from '../../navbar_text/page';
import Hero from '../hero/page';

const Navbar = () => {
  return (
      <div className='w-full h-32 bg-[#FAFAFA] px-24 flex items-center justify-between'>
        <img src="/img/logo_title.svg" className='h-20' alt="Company Logo" />
        <div className='flex'> 
          <NavText text="Beranda" href="/" />
          <NavText text="Tentang" href="/about" />
          <NavText text="Fitur" href="/features" />
          <NavText text="Kelebihan" href="/advantages" />
          <NavText text="Testimoni" href="/Testimony" />
        </div>
        <div className='flex'>
          <div className='mr-3'>
              <ButtonPink />
          </div>
          <ButtonWhite />
        </div>
      </div>
  );
}

export default Navbar;