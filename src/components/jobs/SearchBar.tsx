'use client';

import { useState } from 'react';
import { Search, MapPin, ChevronDown } from 'lucide-react';
import { JOB_CATEGORIES, JOB_TYPES } from '@/types';

interface SearchBarProps {
  onSearch: (params: { search: string; category: string; type: string; location: string }) => void;
  compact?: boolean;
}

export default function SearchBar({ onSearch, compact }: SearchBarProps) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [type, setType] = useState('');
  const [location, setLocation] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({ search, category, type, location });
  };

  return (
    <form onSubmit={handleSubmit} className={`bg-white rounded-2xl shadow-lg p-3 ${compact ? '' : 'p-4'}`}>
      <div className={`flex flex-col gap-3 ${compact ? 'md:flex-row' : 'md:flex-row'}`}>
        {/* Search input */}
        <div className="flex items-center gap-2 flex-1 px-3 py-2 border border-gray-200 rounded-xl focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10">
          <Search size={18} className="text-gray-400 flex-shrink-0" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Job title, company, or keyword..."
            className="flex-1 text-sm outline-none text-gray-900 placeholder-gray-400"
          />
        </div>

        {/* Location */}
        <div className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-xl focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 md:w-44">
          <MapPin size={18} className="text-gray-400 flex-shrink-0" />
          <input
            type="text"
            value={location}
            onChange={e => setLocation(e.target.value)}
            placeholder="Location"
            className="flex-1 text-sm outline-none text-gray-900 placeholder-gray-400 w-full"
          />
        </div>

        {/* Category */}
        <div className="relative flex items-center gap-2 md:w-44">
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 appearance-none bg-white pr-8"
          >
            <option value="">All Categories</option>
            {JOB_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <ChevronDown size={14} className="absolute right-3 text-gray-400 pointer-events-none" />
        </div>

        {/* Type */}
        <div className="relative flex items-center gap-2 md:w-40">
          <select
            value={type}
            onChange={e => setType(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 appearance-none bg-white pr-8"
          >
            <option value="">All Types</option>
            {Object.entries(JOB_TYPES).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
          <ChevronDown size={14} className="absolute right-3 text-gray-400 pointer-events-none" />
        </div>

        <button type="submit" className="btn-primary whitespace-nowrap">
          Search Jobs
        </button>
      </div>
    </form>
  );
}
