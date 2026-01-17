// Types for real Polymarket API data

export interface Token {
  outcome: string;
  price: number;
}

export interface Market {
  id: string;
  question: string;
  description: string;
  yesProbability: number; // 0-100
  noProbability: number; // 0-100
  yesPrice: number; // 0-1 (raw price)
  noPrice: number; // 0-1 (raw price)
  volume: string;
  volumeScore?: number; // For sorting by volume
  endDate: string;
  image: string;
  icon?: string;
  tags: string[];
  marketSlug: string;
  active: boolean;
  acceptingOrders: boolean;
  eventName?: string;
  eventSlug?: string;
}

export type Category = "all" | "politics" | "crypto" | "sports" | "business" | "other";

export const CATEGORY_MAP: Record<string, Category> = {
  politics: "politics",
  "u.s. politics": "politics",
  "u.s. 2024 elections": "politics",
  elections: "politics",
  crypto: "crypto",
  blockchain: "crypto",
  "defi": "crypto",
  bitcoin: "crypto",
  ethereum: "crypto",
  sports: "sports",
  "nba": "sports",
  "nfl": "sports",
  "nhl": "sports",
  "ufc": "sports",
  "mma": "sports",
  soccer: "sports",
  "football": "sports",
  "basketball": "sports",
  "baseball": "sports",
  "hockey": "sports",
  "tennis": "sports",
  "golf": "sports",
  "boxing": "sports",
  "wrestling": "sports",
  "olympics": "sports",
  "super bowl": "sports",
  "world cup": "sports",
  "ncaa": "sports",
  "march madness": "sports",
  business: "business",
  finance: "business",
  economics: "business",
  trading: "business",
  stocks: "business",
};

export function getCategoryFromTags(tags: string[]): Category {
  const normalizedTags = tags.map((t) => t.toLowerCase());

  for (const tag of normalizedTags) {
    if (CATEGORY_MAP[tag]) {
      return CATEGORY_MAP[tag];
    }
  }

  return "other";
}

export const CATEGORIES: { id: Category; label: string; emoji: string }[] = [
  { id: "all", label: "Trending", emoji: "🔥" },
  { id: "politics", label: "Politics", emoji: "🇺🇸" },
  { id: "crypto", label: "Crypto", emoji: "₿" },
  { id: "sports", label: "Sports", emoji: "⚽" },
  { id: "business", label: "Business", emoji: "💰" },
  { id: "other", label: "Other", emoji: "📊" },
];
