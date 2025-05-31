"use client";

import React, { useState, useEffect } from "react";
import { Lightbulb, ExternalLink, Loader2, AlertTriangle } from "lucide-react";
import api from "@/lib/api";

interface Recommendation {
  title: string;
  description: string;
  category?: string;
  potentialSavings?: number;
  actionable: boolean;
}

interface AIRecommendationProps {
  dataVersion: number;
}

const AIRecommendation = ({ dataVersion }: AIRecommendationProps) => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await api.get("/api/expenses/recommendations");
        if (response.data.success) {
          setRecommendations(response.data.recommendations || []);
        } else {
          throw new Error(response.data.message || "Gagal mengambil rekomendasi.");
        }
      } catch (err: any) {
        console.error("Error fetching recommendations:", err);
        setError(err.response?.data?.message || err.message || "Terjadi kesalahan.");
        setRecommendations([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendations();
  }, [dataVersion]);

  return (
    <div className="mb-8">
      <p className="text-[var(--color-p-300)] font-semibold text-xl mb-4">Rekomendasi AI</p>
      <div className="w-full min-h-[16rem] shadow-md rounded-2xl bg-white p-6">
        {isLoading ? (
          <div className="flex flex-col justify-center items-center h-40">
            <Loader2 className="w-8 h-8 animate-spin text-[var(--color-p-300)] mb-3" />
            <p className="text-gray-500">Memuat rekomendasi...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col justify-center items-center h-40 text-red-500">
            <AlertTriangle size={32} className="mb-3" />
            <p className="text-center">{error}</p>
          </div>
        ) : recommendations.length === 0 ? (
          <div className="flex flex-col justify-center items-center h-40 text-gray-400">
            <Lightbulb size={48} className="mb-3" />
            <p className="text-center text-gray-500">Belum ada rekomendasi yang tersedia</p>
          </div>
        ) : (
          <div className="space-y-4">
            {recommendations.map((recommendation, index) => (
              <div key={index} className="p-4 bg-blue-50 rounded-xl">
                <div className="flex items-start gap-3">
                  <Lightbulb size={20} className="text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-800 mb-1">{recommendation.title}</p>
                    <p className="text-sm text-gray-600 mb-2">{recommendation.description}</p>

                    {recommendation.potentialSavings && <p className="text-sm font-medium text-green-600">Potensi penghematan: Rp {recommendation.potentialSavings.toLocaleString("id-ID")}</p>}

                    {recommendation.actionable && (
                      <a href="#" className="inline-flex items-center text-blue-600 text-sm mt-2 hover:underline">
                        Pelajari lebih lanjut <ExternalLink size={14} className="ml-1" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AIRecommendation;
