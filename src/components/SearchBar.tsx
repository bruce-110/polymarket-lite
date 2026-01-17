"use client";

import { useState } from "react";
import { Search, X } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchBar({ value, onChange, placeholder = "Search markets..." }: SearchBarProps) {
  const [localValue, setLocalValue] = useState(value);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    onChange(newValue);
  };

  const handleClear = () => {
    setLocalValue("");
    onChange("");
  };

  return (
    <div className="relative w-full">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-gray-400" />
      </div>
      <input
        type="text"
        value={localValue}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full pl-10 pr-10 py-3 rounded-lg border transition-all focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
        style={{
          backgroundColor: 'var(--search-bg, #ffffff)',
          borderColor: 'var(--search-border, #e8e4dc)',
          color: 'var(--search-text, #1a1a1a)',
          fontFamily: 'Inter, sans-serif',
          fontSize: '0.95rem',
        }}
      />
      {localValue && (
        <button
          onClick={handleClear}
          className="absolute inset-y-0 right-0 pr-3 flex items-center hover:bg-gray-100 rounded-r-lg transition-colors"
          style={{ color: 'var(--search-text-secondary, #666)' }}
        >
          <X className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}
