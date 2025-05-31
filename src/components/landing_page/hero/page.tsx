import ButtonHero from "@/components/button_hero/page";
import Link from "next/link";
import React from "react";

const Hero = () => {
  return (
    <div className="relative w-full h-[900px] px-12 mt-8">
      <div className="absolute inset-0 z-10 rounded-4xl"></div>
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-6xl font-bold text-white shadow-lg">Selamat datang di Healio.ai</h1>
        <p className="text-2xl font-medium text-gray-200 mt-4 max-w-3xl">Solusi Kesehatan Terintegrasi Untukmu!</p>
        <div className="mt-8">
          <Link href="/dashboard">
            <ButtonHero />
          </Link>
        </div>
      </div>

      <img src="img/hero_image.png" className="w-full h-full object-cover z-0 rounded-4xl" alt="Hero" />
    </div>
  );
};

export default Hero;

