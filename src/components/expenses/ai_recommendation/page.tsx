"use client";

import React, { useState, useEffect } from "react";
import { Lightbulb, Loader2, AlertTriangle } from "lucide-react";
import api from "@/lib/api";

interface AIRecommendationProps {
  dataVersion: number;
  isLoading?: boolean;
}

const AIRecommendation: React.FC<AIRecommendationProps> = ({ dataVersion }) => {
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [isLoadingInternal, setIsLoadingInternal] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      setIsLoadingInternal(true);
      setError(null);
      try {
        const response = await api.get("/api/expenses/recommendations");
        if (response.data.success) {
          setRecommendations(response.data.recommendations || []);
        } else {
          throw new Error(response.data.message || "Gagal mengambil rekomendasi AI.");
        }
      } catch (err: any) {
        setError(err.response?.data?.message || err.message || "Terjadi kesalahan.");
        setRecommendations([]);
      } finally {
        setIsLoadingInternal(false);
      }
    };

    fetchRecommendations();
  }, [dataVersion]);

  return (
    <div className="p-6 bg-white rounded-xl shadow-md mb-6 min-h-[150px]">
      <div className="flex items-center gap-3 mb-3">
        <Lightbulb className="text-[var(--color-p-300)]" size={24} />
        <h2 className="text-xl font-semibold text-gray-800">Rekomendasi AI</h2>
      </div>

      {isLoadingInternal ? (
        <div className="flex justify-center items-center h-24">
          <Loader2 className="w-6 h-6 animate-spin text-[var(--color-p-300)]" />
        </div>
      ) : error ? (
        <div className="flex flex-col justify-center items-center h-24 text-red-500">
          <AlertTriangle size={24} className="mb-1" />
          <p className="text-sm">{error}</p>
        </div>
      ) : recommendations.length > 0 && recommendations[0] !== "Belum ada data pengeluaran yang cukup untuk memberikan rekomendasi." && recommendations[0] !== "Gagal mendapatkan rekomendasi dari AI saat ini." ? (
        <div className="text-gray-600 text-sm">
          <ul className="list-disc ml-5 space-y-1.5">
            {recommendations.map((rec, index) => (
              <li key={index}>{rec}</li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="text-sm text-gray-500 text-center py-4">{recommendations.length > 0 ? recommendations[0] : "Tidak ada rekomendasi saat ini."}</p>
      )}
    </div>
  );
};

export default AIRecommendation;

