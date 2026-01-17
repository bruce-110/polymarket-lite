import useSWR from "swr";
import { Market } from "@/types/market";

// Error types for better handling
class MarketFetchError extends Error {
  constructor(
    message: string,
    public code?: string,
    public status?: number
  ) {
    super(message);
    this.name = "MarketFetchError";
  }
}

const fetcher = async (url: string): Promise<Market[]> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

  try {
    const res = await fetch(url, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      // Handle different error statuses
      if (res.status === 429) {
        throw new MarketFetchError(
          "Too many requests. Please try again later.",
          "RATE_LIMIT",
          429
        );
      }
      if (res.status === 500) {
        throw new MarketFetchError(
          "Server error. Please try again later.",
          "SERVER_ERROR",
          500
        );
      }
      if (res.status === 503) {
        throw new MarketFetchError(
          "Service temporarily unavailable.",
          "SERVICE_UNAVAILABLE",
          503
        );
      }
      throw new MarketFetchError(
        `Failed to fetch markets (Status: ${res.status})`,
        "FETCH_ERROR",
        res.status
      );
    }

    const data = await res.json();

    if (!Array.isArray(data)) {
      throw new MarketFetchError(
        "Invalid data format received from server.",
        "INVALID_DATA"
      );
    }

    return data;
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof MarketFetchError) {
      throw error;
    }

    // Handle abort/timeout
    if (error instanceof Error && error.name === "AbortError") {
      throw new MarketFetchError(
        "Request timeout. Please check your connection.",
        "TIMEOUT"
      );
    }

    // Handle network errors
    if (error instanceof TypeError) {
      throw new MarketFetchError(
        "Network error. Please check your connection.",
        "NETWORK_ERROR"
      );
    }

    // Unknown errors
    throw new MarketFetchError(
      "An unexpected error occurred.",
      "UNKNOWN_ERROR"
    );
  }
};

export function useMarkets() {
  const { data, error, isLoading, isValidating, mutate } = useSWR<Market[]>(
    "/api/markets",
    fetcher,
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      refreshInterval: 10000,
      dedupingInterval: 5000,
      errorRetryCount: 2,
      errorRetryInterval: 3000,
      shouldRetryOnError: (error) => {
        // Don't retry on rate limits or client errors
        if (error instanceof MarketFetchError) {
          return error.code !== "RATE_LIMIT" &&
                 error.code !== "NETWORK_ERROR";
        }
        return true;
      },
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

export type { MarketFetchError };
