"use client";
import React from "react";
import Link from "next/link";
import ButtonPink from "@/components/button_pink/page"; // Untuk tombol Daftar
import ButtonWhite from "@/components/button_white/page"; // Untuk tombol Masuk
import NavText from "../../navbar_text/page";
import { useAuth } from "@/lib/auth"; // Import useAuth

const Navbar = () => {
  const { isAuthenticated, loading } = useAuth();

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
        {!loading &&
          (isAuthenticated ? (
            <Link href="/dashboard">
              <div
                className="px-8 py-4 bg-[var(--color-p-300)] rounded-4xl cursor-pointer transition-all duration-300 group
                hover:bg-[var(--color-w-300)] border border-transparent hover:border-[var(--color-p-300)]"
              >
                <p className="text-[#FAFAFA] font-semibold transition-colors duration-300 group-hover:text-[var(--color-p-300)]">Dashboard</p>
              </div>
            </Link>
          ) : (
            <>
              <div className="mr-3">
                <ButtonPink />
              </div>
              <ButtonWhite />
            </>
          ))}
      </div>
    </div>
  );
};

export default Navbar;
