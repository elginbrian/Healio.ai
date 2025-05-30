const RecentExpenses = () => {
  const transactions = Array(5).fill({
    title: 'Transaksi Apotek Sehat',
    date: '22 Mei 2025, 12.53 WIB',
    amount: 'Rp37.000'
  });

  return (
    <div className='mb-8'>
      <p className='text-[var(--color-p-300)] font-semibold text-xl mb-4'>Pengeluaran Terkini</p>
      <div className='w-full h-96 shadow-md rounded-2xl bg-white p-6'>
        <div className='flex border-b border-gray-200 mb-4'>
          <button className='py-2 px-4 text-[var(--color-p-300)] font-semibold border-b-2 border-[var(--color-p-300)]'>
            Pengeluaran Terkini
          </button>
          <button className='py-2 px-4 text-gray-500 font-semibold'>
            Semua Pengeluaran
          </button>
        </div>

        <div className='space-y-4 overflow-y-auto h-[calc(100%-60px)] custom-scrollbar'>
          {transactions.map((item, index) => (
            <div key={index} className='flex items-center justify-between p-4 bg-gray-50 rounded-lg shadow-sm'>
              <div className='flex items-center'>
                <div className='p-3 bg-blue-100 rounded-full mr-4'>
                  <svg className="w-6 h-6 text-[var(--color-p-300)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c1.657 0 3 1.343 3 3v2a3 3 0 01-3 3h-2a3 3 0 01-3-3v-2c0-1.657 1.343-3 3-3zm-1 9a1 1 0 100 2h2a1 1 0 100-2h-2z"></path></svg>
                </div>
                <div>
                  <p className='text-lg font-semibold text-[var(--color-p-300)]'>{item.title}</p>
                  <p className='text-sm text-gray-500'>{item.date}</p>
                </div>
              </div>
              <p className='text-lg font-bold text-[var(--color-p-300)]'>{item.amount}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecentExpenses;
