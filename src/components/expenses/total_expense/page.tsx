import { TrendingUp } from "lucide-react";

const TotalExpenseCard = () => (
  <div className="flex flex-col justify-between bg-[var(--color-p-300)] rounded-xl p-6 shadow-md overflow-hidden relative">
    <div className="absolute top-0 right-0 w-32 h-32 -mt-8 -mr-8 bg-[var(--color-p-400)] rounded-full opacity-20"></div>
    <div className="absolute bottom-0 left-0 w-24 h-24 -mb-8 -ml-8 bg-[var(--color-p-400)] rounded-full opacity-20"></div>

    <div className="mb-4 z-10">
      <p className="text-lg font-medium text-white/90">Total Pengeluaran</p>
      <div className="flex items-center mt-1">
        <p className="text-3xl font-bold text-white">Rp. 500.000</p>
        <div className="ml-2 flex items-center bg-white/20 rounded-full px-2 py-1 text-xs text-white">
          <TrendingUp size={12} className="mr-1" />
          <span>5% dari bulan lalu</span>
        </div>
      </div>
    </div>

    <div className="flex justify-between items-center z-10">
      <p className="text-white/90 font-medium">Bulan ini</p>
      <button className="bg-white/20 hover:bg-white/30 text-white text-sm font-medium py-1 px-3 rounded-full transition-colors">Lihat Detail</button>
    </div>
  </div>
);

export default TotalExpenseCard;
