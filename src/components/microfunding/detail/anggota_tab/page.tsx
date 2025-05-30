import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface Member {
  name: string;
  email: string;
  status: 'Aktif' | 'Menunggu' | 'Ditolak';
  joinedDate: string;
  contribution: number;
  claim: number;
  isAdmin: boolean;
  profileImage: string;
}

const members: Member[] = [
  {
    name: 'Johan Arizona',
    email: 'johan1234@gmail.com',
    status: 'Aktif',
    joinedDate: '10 Jan 2025',
    contribution: 200000,
    claim: 0,
    isAdmin: true,
    profileImage: '/img/hospital_dummy.png', // Replace with actual path to dummy image if needed
  },
  {
    name: 'Johan Arizona',
    email: 'johan1234@gmail.com',
    status: 'Aktif',
    joinedDate: '10 Jan 2025',
    contribution: 200000,
    claim: 0,
    isAdmin: true,
    profileImage: '/img/hospital_dummy.png',
  },
  {
    name: 'Johan Arizona',
    email: 'johan1234@gmail.com',
    status: 'Aktif',
    joinedDate: '10 Jan 2025',
    contribution: 200000,
    claim: 0,
    isAdmin: true,
    profileImage: '/img/hospital_dummy.png',
  },
  {
    name: 'Johan Arizona',
    email: 'johan1234@gmail.com',
    status: 'Aktif',
    joinedDate: '10 Jan 2025',
    contribution: 200000,
    claim: 0,
    isAdmin: true,
    profileImage: '/img/hospital_dummy.png',
  },
];

const AnggotaTab = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl font-bold text-gray-800">Daftar Anggota</h3>
        <div className="flex items-center text-gray-600">
          Total: <span className="font-bold ml-1">12 Anggota</span>
          <div className="ml-2 flex flex-col">
            <ChevronUp size={16} className="cursor-pointer text-gray-400 hover:text-gray-600" />
            <ChevronDown size={16} className="cursor-pointer text-gray-400 hover:text-gray-600" />
          </div>
        </div>
      </div>

      <div className="overflow-y-auto max-h-96 pr-2 custom-scrollbar"> {/* Added custom-scrollbar for styling */}
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 sticky top-0">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nama
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Bergabung
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Kontribusi
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Klaim
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {members.map((member, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <img className="h-10 w-10 rounded-full" src={member.profileImage} alt={`${member.name}'s profile`} />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{member.name}</div>
                      <div className="text-sm text-gray-500">{member.isAdmin ? 'Admin' : 'Member'}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                    ${member.status === 'Aktif' ? 'bg-green-100 text-green-800' : ''}
                  `}>
                    {member.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {member.joinedDate}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Rp{member.contribution.toLocaleString('id-ID')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {member.claim}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AnggotaTab;