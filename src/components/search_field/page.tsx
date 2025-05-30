"use client";

import React, { useState } from "react";
import { Search } from "lucide-react";

interface TextFieldProps {
  placeholder?: string;
  onSearch?: (searchTerm: string) => void;
}

const SearchField = ({ placeholder = "Cari Fasilitas Kesehatan", onSearch }: TextFieldProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchClick = () => {
    if (onSearch) {
      onSearch(searchTerm);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSearchClick();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onSearch?.(searchTerm);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative flex items-center w-full max-w-xl border-2 border-[var(--color-p-300)] rounded-full overflow-hidden">
      <input type="text" placeholder={placeholder} value={searchTerm} onChange={handleInputChange} onKeyPress={handleKeyPress} className="flex-grow py-3 pl-6 pr-4 outline-none text-lg text-gray-800 placeholder-gray-500 bg-white" />
      <button
        type="submit"
        onClick={handleSearchClick}
        className="p-4 bg-[var(--color-p-300)] text-white hover:bg-[var(--color-p-400)] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-p-400)]"
        aria-label="Cari"
      >
        <Search size={24} />
      </button>
    </form>
  );
};

export default SearchField;
