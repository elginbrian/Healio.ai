import React from 'react'

interface SidebarItemProps {
  name: string
  active: boolean
  onClick: () => void
  activeSrc: string
  inactiveSrc: string
}

const SidebarItem: React.FC<SidebarItemProps> = ({ active, onClick, activeSrc, inactiveSrc }) => {
  return (
    <div
      onClick={onClick}
      className={`mb-4 w-14 h-14 rounded-xl flex items-center justify-center cursor-pointer transition-all duration-300 ${
        active ? 'bg-[var(--color-p-300)]' : 'bg-gray-100'
      }`}
    >
      <img src={active ? activeSrc : inactiveSrc} alt="icon" className="w-6 h-6" />
    </div>
  )
}

export default SidebarItem
