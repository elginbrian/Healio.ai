'use client';
import React from 'react';

interface CategoryFilterProps {
    categories: string[];
    selectedCategory: string | null;
    onSelectCategory: (category: string) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ categories, selectedCategory, onSelectCategory }) => {
    return (
        <div className='flex flex-wrap gap-2 mb-8'>
            {categories.map((category) => (
                <button
                    key={category}
                    className={`px-6 py-2 rounded-full font-medium ${category === selectedCategory
                        ? 'bg-[var(--color-p-300)] text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        } transition-colors duration-200`}
                    onClick={() => onSelectCategory(category)}
                >
                    {category}
                </button>
            ))}
        </div>
    );
};

export default CategoryFilter;
