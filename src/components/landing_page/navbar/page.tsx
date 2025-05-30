"use client";
import React from "react";
import ButtonPink from "@/components/button_pink/page";
import ButtonWhite from "@/components/button_white/page";
import NavText from "../../navbar_text/page";
import Link from "next/link";

const Navbar = () => {
  return (
    <div className="sticky top-0 z-50 w-full h-24 bg-[#FAFAFA] bg-opacity-80 backdrop-blur-md px-4 md:px-24 flex items-center justify-between shadow-sm transition-all duration-300">
      <Link href="/">
        <img src="/img/logo_title.svg" className="h-16 cursor-pointer" alt="Company Logo" />
      </Link>
      <div className="hidden lg:flex items-center">
        <NavText text="Beranda" href="/" />
        <NavText text="Tentang" href="#about" />
        <NavText text="Fitur" href="#features" />
        <NavText text="Testimoni" href="#testimony" />
        <NavText text="FAQ" href="#faq" />
      </div>
      <div className="flex items-center">
        <div className="mr-3">
          <ButtonPink />
        </div>
        <ButtonWhite />
      </div>
    </div>
  );
};

export default Navbar;
