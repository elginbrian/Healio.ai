import React from "react";
import { Lightbulb } from "lucide-react";

interface AIRecommendationProps {
  isLoading?: boolean;
}

const AIRecommendation: React.FC<AIRecommendationProps> = ({ isLoading = false }) => {
  return (
    <div className="p-6 bg-white rounded-xl shadow-md mb-6">
      <div className="flex items-center gap-3 mb-4">
        <Lightbulb className="text-[var(--color-p-300)]" size={24} />
        <h2 className="text-xl font-semibold text-gray-800">Rekomendasi AI</h2>
      </div>

      {isLoading ? (
        <div className="animate-pulse flex flex-col gap-3">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
      ) : (
        <div className="text-gray-600">
          <p>Berdasarkan pola pengeluaran Anda, kami merekomendasikan:</p>
          <ul className="list-disc ml-6 mt-2 space-y-1">
            <li>Alokasikan lebih banyak dana untuk konsultasi rutin</li>
            <li>Pertimbangkan untuk bergabung dengan asuransi kesehatan</li>
            <li>Bergabunglah dengan dana komunal untuk pengeluaran besar</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default AIRecommendation;
