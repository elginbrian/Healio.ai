"use client";

import React, { useState, useEffect } from "react";
import { Lightbulb, Loader2, AlertTriangle, RefreshCw, PlusCircle } from "lucide-react";
import api from "@/lib/api";
import Link from "next/link";

interface AIRecommendationProps {
  dataVersion: number;
}

const AIRecommendation: React.FC<AIRecommendationProps> = ({ dataVersion }) => {
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const fetchRecommendations = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get("/api/expenses/recommendations");
      if (response.data.success) {
        setRecommendations(response.data.recommendations || []);
      } else {
        throw new Error(response.data.message || "Gagal mengambil rekomendasi AI.");
      }
    } catch (err: any) {
      console.error("Error fetching AI recommendations:", err);
      setError(err.response?.data?.message || err.message || "Terjadi kesalahan.");
      setRecommendations([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, [dataVersion, retryCount]);

  const handleRetry = () => {
    setRetryCount((prev) => prev + 1);
  };

  const legacyNoDataMessage = "Belum ada data pengeluaran yang cukup untuk memberikan rekomendasi.";
  const legacyErrorMessage = "Gagal mendapatkan rekomendasi dari AI saat ini.";

  const hasValidRecommendations = recommendations.length > 0 && !recommendations.includes(legacyNoDataMessage) && !recommendations.includes(legacyErrorMessage);

  return (
    <div className="p-6 bg-white rounded-xl shadow-md mb-6 min-h-[150px]">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <Lightbulb className="text-[var(--color-p-300)]" size={24} />
          <h2 className="text-xl font-semibold text-gray-800">Rekomendasi AI</h2>
        </div>
        {!isLoading && error && (
          <button onClick={handleRetry} className="flex items-center text-xs text-gray-500 hover:text-[var(--color-p-300)] transition-colors">
            <RefreshCw size={14} className="mr-1" /> Coba lagi
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-24">
          <Loader2 className="w-6 h-6 animate-spin text-[var(--color-p-300)]" />
        </div>
      ) : error ? (
        <div className="flex flex-col justify-center items-center h-24 text-red-500">
          <AlertTriangle size={24} className="mb-1" />
          <p className="text-sm">{error}</p>
        </div>
      ) : hasValidRecommendations ? (
        <div className="text-gray-600 text-sm">
          <ul className="list-disc ml-5 space-y-1.5">
            {recommendations.map((rec, index) => (
              <li key={index}>{rec}</li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="text-center py-4">
          <p className="text-sm text-gray-500 mb-3">{recommendations.length > 0 ? recommendations[0] : "Belum bisa memberikan rekomendasi spesifik."}</p>
          <Link href="/dashboard/expenses">
            <button className="inline-flex items-center text-xs text-[var(--color-p-300)] hover:text-[var(--color-p-400)] transition-colors">
              <PlusCircle size={14} className="mr-1" /> Tambah transaksi untuk rekomendasi lebih personal
            </button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default AIRecommendation;

