"use client";
import React from "react";
import Link from "next/link";

const ButtonWhite = () => {
  return (
    <Link href="/login">
      <div className="px-8 py-4 bg-[var(--color-w-300)] rounded-4xl border border-[var(--color-p-300)] cursor-pointer transition-all duration-300 hover:bg-[var(--color-p-300)] group">
        <p className="text-[var(--color-p-300)] font-semibold transition-colors duration-300 group-hover:text-[#FAFAFA]">Masuk</p>
      </div>
    </Link>
  );
};

export default ButtonWhite;
