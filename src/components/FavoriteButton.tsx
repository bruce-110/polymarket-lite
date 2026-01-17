"use client";

import { Star } from "lucide-react";

interface FavoriteButtonProps {
  isFavorite: boolean;
  onToggle: () => void;
  size?: "sm" | "md";
}

export function FavoriteButton({ isFavorite, onToggle, size = "sm" }: FavoriteButtonProps) {
  const sizeClasses = size === "sm" ? "h-8 w-8" : "h-10 w-10";

  return (
    <button
      onClick={onToggle}
      className={`rounded-full transition-all hover:scale-110 active:scale-95 ${sizeClasses} flex items-center justify-center`}
      style={{
        backgroundColor: isFavorite ? 'rgba(255, 215, 0, 0.2)' : 'var(--fav-bg, rgba(0, 0, 0, 0.05))',
        border: isFavorite ? '2px solid #FFD700' : '2px solid transparent',
      }}
      onMouseEnter={(e) => {
        if (!isFavorite) {
          e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.1)';
        }
      }}
      onMouseLeave={(e) => {
        if (!isFavorite) {
          e.currentTarget.style.backgroundColor = 'var(--fav-bg, rgba(0, 0, 0, 0.05))';
        }
      }}
    >
      <Star
        className={`${size === "sm" ? "h-4 w-4" : "h-5 w-5"} transition-all`}
        style={{
          fill: isFavorite ? '#FFD700' : 'none',
          color: isFavorite ? '#FFD700' : 'var(--fav-color, #666)',
        }}
      />
    </button>
  );
}
