"use client";

import { useState, useEffect } from "react";

export function useFavorites() {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [mounted, setMounted] = useState(false);

  // Load favorites from localStorage on mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem("favorites");
    if (savedFavorites) {
      try {
        const parsed = JSON.parse(savedFavorites);
        setFavorites(new Set(parsed));
      } catch (e) {
        console.error("Failed to parse favorites:", e);
      }
    }
    setMounted(true);
  }, []);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    if (mounted) {
      localStorage.setItem("favorites", JSON.stringify(Array.from(favorites)));
    }
  }, [favorites, mounted]);

  const toggleFavorite = (marketId: string) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(marketId)) {
        newFavorites.delete(marketId);
      } else {
        newFavorites.add(marketId);
      }
      return newFavorites;
    });
  };

  const isFavorite = (marketId: string) => {
    return favorites.has(marketId);
  };

  return {
    favorites,
    toggleFavorite,
    isFavorite,
    mounted,
  };
}
