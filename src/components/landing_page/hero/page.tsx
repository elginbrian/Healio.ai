import ButtonHero from '@/components/button_hero/page'
import ButtonWhite from '@/components/button_white/page'
import React from 'react'

const Hero = () => {
  return (
    <div className="relative w-full h-[900px] px-12 mb-48">
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-4">
        <p className="text-6xl font-semibold text-[var(--color-w-300)]">Selamat datang di Healio.ai</p>
        <p className="text-2xl font-medium text-[var(--color-w-300)] mt-4">Solusi Kesehatan Terintegrasi Untukmu!</p>
        <div className="mt-4">
            <ButtonHero />
        </div>
      </div>

      <img src="img/hero_image.png" className="w-full h-full object-cover z-0 rounded-4xl" alt="Hero" />
    </div>
  )
}

export default Hero