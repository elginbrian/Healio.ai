"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, redirectTo = "/login" }) => {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      toast.error("Akses ditolak. Anda harus login untuk melihat halaman ini.", {
        id: "auth-redirect-toast",
      });
      router.replace(redirectTo);
    }
  }, [isAuthenticated, loading, router, redirectTo]);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50">
        <Loader2 className="w-12 h-12 animate-spin text-[var(--color-p-300)] mb-4" />
        <p className="text-lg text-gray-600">Memverifikasi sesi Anda...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50">
        <Loader2 className="w-12 h-12 animate-spin text-[var(--color-p-300)] mb-4" />
        <p className="text-lg text-gray-600">Mengalihkan ke halaman login...</p>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;

