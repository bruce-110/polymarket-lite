import useSWR from "swr";
import { Market } from "@/types/market";

const fetcher = async (url: string): Promise<Market[]> => {
  const res = await fetch(url, {
    cache: 'no-store', // Disable browser caching
    headers: {
      'Cache-Control': 'no-cache',
    }
  });
  if (!res.ok) {
    const error = new Error("Failed to fetch markets");
    throw error;
  }
  return res.json();
};

export function useMarkets() {
  const { data, error, isLoading, isValidating, mutate } = useSWR<Market[]>(
    "/api/markets",
    fetcher,
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      refreshInterval: 10000, // Reduced to 10 seconds for more real-time updates
      dedupingInterval: 5000, // Reduced deduping for fresher data
      errorRetryCount: 3,
      errorRetryInterval: 5000,
    }
  );

  // Fix 2025 → 2026 in tags
  const markets = (data || []).map(market => ({
    ...market,
    tags: market.tags.map(tag =>
      tag.replace(/2025/g, "2026")
        .replace(/2025 Predictions/g, "2026 Predictions")
    )
  }));

  return {
    markets,
    isLoading,
    isValidating,
    error,
    mutate,
  };
}
