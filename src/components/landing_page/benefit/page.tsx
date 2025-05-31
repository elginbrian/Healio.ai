import BenefitItem from "@/components/benfit_item/page";
import React from "react";

const Benefit = () => {
  return (
    <div className="flex flex-col justify-center items-center">
      <p className="text-5xl text-[var(--color-p-300)] font-semibold mb-12 text-center">Kelebihan Healio.ai</p>
      <div className="flex flex-col md:flex-row gap-8 md:gap-0">
        <BenefitItem imageSrc={"img/personal_solution.svg"} title={"Solusi Personal"} description={"AI kami menyesuaikan rekomendasi dan analisis berdasarkan profil dan kebutuhan unik Anda."} />
        <BenefitItem imageSrc={"img/eye.svg"} title={"Transparansi Tinggi"} description={"Verifikasi KTP untuk donatur dan penerima menjaga kepercayaan dalam setiap transaksi."} />
        <BenefitItem imageSrc={"img/shield.svg"} title={"Keamanan Terjamin"} description={"Dashboard real-time dan laporan transaksi memastikan setiap dana dikelola dengan jelas dan adil."} />
      </div>
    </div>
  );
};

export default Benefit;
