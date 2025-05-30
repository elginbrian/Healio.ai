const AIRecommendation = () => (
  <div className='w-full'>
    <p className='text-[var(--color-p-300)] font-semibold text-xl mb-4'>Rekomendasi AI</p>
    <div className='shadow-lg rounded-2xl bg-white p-6'>
      <img src="/img/ai_pink.svg" alt="AI Recommendation" className=' object-cover rounded-lg mb-4' />
      <p className='text-justify text-gray-700 leading-relaxed'>
        Anda bisa membeli paket Paracetamol (50 tablet) seharga Rp 45.000 untuk menghemat Rp 5.000 dibandingkan pembelian satuan. Manfaatkan promo konsultasi di klinik terdekat untuk mengurangi biaya hingga 15%. Gunakan diskon tes lab yang ditawarkan oleh rumah sakit mitra untuk penghematan hingga 20%. Pertimbangkan berlangganan paket kesehatan bulanan yang dapat menurunkan biaya konsultasi rutin secara signifikan.
      </p>
    </div>
  </div>
);

export default AIRecommendation;
