"use client";

import { ChevronDown } from "lucide-react";
import { SortOption, sortOptions } from "@/lib/theme";

interface SortSelectorProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
}

export function SortSelector({ value, onChange }: SortSelectorProps) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as SortOption)}
        className="appearance-none pr-10 pl-4 py-2.5 rounded-lg border transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-green-500"
        style={{
          backgroundColor: 'var(--sort-bg, #ffffff)',
          borderColor: 'var(--sort-border, #e8e4dc)',
          color: 'var(--sort-text, #1a1a1a)',
          fontFamily: 'Inter, sans-serif',
          fontSize: '0.9rem',
          fontWeight: '500',
        }}
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            Sort: {option.label}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
        <ChevronDown className="h-4 w-4" style={{ color: 'var(--sort-text-secondary, #666)' }} />
      </div>
    </div>
  );
}
