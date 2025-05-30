"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await axios.post("/api/auth/login", { email, password });

      localStorage.setItem("token", response.data.token);
      router.push("/dashboard");
    } catch (err) {
      const errorMessage = axios.isAxiosError(err) ? err.response?.data?.message || "Login gagal" : "Terjadi kesalahan saat login";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full items-center justify-center overflow-hidden bg-[var(--background)] p-4">
      <div className="flex h-full w-full max-w-6xl overflow-hidden rounded-2xl bg-white shadow-lg lg:flex-row flex-col">
        <div className="hidden lg:block lg:w-1/2 h-full">
          <Image src="/img/register_image.png" alt="Doctor holding a stethoscope" width={800} height={1200} className="h-full w-full object-cover" />
        </div>

        <div className="flex flex-col h-full w-full items-center justify-center p-8 lg:w-1/2 overflow-hidden">
          <div className="w-full max-w-md overflow-y-auto max-h-full">
            <div className="mb-8 flex justify-center">
              <img src="/img/logo.svg" alt="Healio.ai Logo" className="h-24 w-24" />
            </div>
            <h1 className="mb-8 text-center text-4xl font-bold text-[var(--color-p-300)]">Selamat Datang di Healio.ai</h1>

            {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-center">{error}</div>}

            <form onSubmit={handleSubmit}>
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
                  disabled={isLoading}
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
                    disabled={isLoading}
                  />
                  <button type="button" onClick={togglePasswordVisibility} className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-[var(--color-p-300)]" disabled={isLoading}>
                    {isPasswordVisible ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                  </button>
                </div>
              </div>
              <button
                type="submit"
                className="mb-4 w-full rounded-xl bg-[var(--color-p-300)] py-4 font-semibold text-white transition-all duration-300 hover:bg-[var(--color-p-400)] disabled:bg-gray-300 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? "Memproses..." : "Masuk"}
              </button>
              <button
                type="button"
                className="flex w-full items-center justify-center rounded-xl border border-gray-300 bg-white py-4 font-semibold text-gray-700 transition-all duration-300 hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                <FcGoogle size={22} className="mr-3" />
                Masuk dengan Google
              </button>
            </form>
            <p className="mt-8 text-center text-gray-600">
              Belum memiliki akun?{" "}
              <Link href="/register" className="font-semibold text-[var(--color-p-300)] hover:underline">
                Daftar
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
