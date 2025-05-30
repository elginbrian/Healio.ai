"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ name, email, password });
  };

  return (
    <div className="flex h-screen w-full items-center justify-center bg-[var(--background)]">
      <div className="flex h-full w-full max-w-6xl overflow-hidden">
        <div className="hidden lg:block lg:w-1/2">
          <Image src="/img/doctor-register.png" alt="Doctor holding a stethoscope" width={800} height={1200} className="h-full w-full object-cover" />
        </div>
        <div className="flex w-full items-center justify-center bg-white p-8 lg:w-1/2">
          <div className="w-full max-w-md">
            <div className="mb-8 flex justify-center">
              <img src="/img/logo_icon.svg" alt="Healio.ai Logo" className="h-16 w-16" />
            </div>
            <h1 className="mb-8 text-center text-4xl font-bold text-[var(--color-p-300)]">Buat akun baru</h1>
            <form onSubmit={handleSubmit}>
              <div className="mb-5">
                <label htmlFor="name" className="mb-2 block text-sm font-medium text-gray-500">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Masukkan nama lengkap Anda"
                  className="w-full rounded-xl border border-gray-300 p-4 text-gray-800 focus:border-[var(--color-p-300)] focus:outline-none focus:ring-1 focus:ring-[var(--color-p-300)]"
                  required
                />
              </div>
              <div className="mb-5">
                <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-500">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contoh@email.com"
                  className="w-full rounded-xl border border-gray-300 p-4 text-gray-800 focus:border-[var(--color-p-300)] focus:outline-none focus:ring-1 focus:ring-[var(--color-p-300)]"
                  required
                />
              </div>
              <div className="mb-6">
                <label htmlFor="password" className="mb-2 block text-sm font-medium text-gray-500">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={isPasswordVisible ? "text" : "password"}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimal 6 karakter"
                    className="w-full rounded-xl border border-gray-300 p-4 text-gray-800 focus:border-[var(--color-p-300)] focus:outline-none focus:ring-1 focus:ring-[var(--color-p-300)]"
                    required
                  />
                  <button type="button" onClick={togglePasswordVisibility} className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-[var(--color-p-300)]">
                    {isPasswordVisible ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                  </button>
                </div>
              </div>
              <button type="submit" className="mb-4 w-full rounded-xl bg-[var(--color-p-300)] py-4 font-semibold text-white transition-all duration-300 hover:bg-[var(--color-p-400)]">
                Daftar
              </button>
              <button type="button" className="flex w-full items-center justify-center rounded-xl border border-gray-300 bg-white py-4 font-semibold text-gray-700 transition-all duration-300 hover:bg-gray-50">
                <Image src="/img/google_logo.svg" alt="Google Logo" width={20} height={20} className="mr-3" />
                Daftar dengan Google
              </button>
            </form>
            <p className="mt-8 text-center text-gray-600">
              Sudah memiliki akun?{" "}
              <Link href="/login" className="font-semibold text-[var(--color-p-300)] hover:underline">
                Masuk
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
