'use client'
import React from 'react'

const ButtonPink = () => {
  return (
    <div className="px-8 py-4 bg-[var(--color-p-300)] rounded-4xl cursor-pointer transition-all duration-300 group 
      hover:bg-[var(--color-w-300)] border border-transparent hover:border-[var(--color-p-300)]">
      <p className="text-[#FAFAFA] font-semibold transition-colors duration-300 group-hover:text-[var(--color-p-300)]">
        Daftar
      </p>
    </div>
  )
}

export default ButtonPink
