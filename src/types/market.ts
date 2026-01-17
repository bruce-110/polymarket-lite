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

export type Category =
  | "all"
  | "politics"
  | "crypto"
  | "sports"
  | "business"
  | "geopolitics"
  | "technology"
  | "entertainment"
  | "science"
  | "other";

export const CATEGORY_MAP: Record<string, Category> = {
  // Politics
  politics: "politics",
  "u.s. politics": "politics",
  "u.s. 2024 elections": "politics",
  "u.s. 2026 elections": "politics",
  elections: "politics",
  "trump": "politics",
  "biden": "politics",
  "congress": "politics",
  "senate": "politics",
  "president": "politics",
  "government": "politics",
  "democrat": "politics",
  "republican": "politics",

  // Crypto
  crypto: "crypto",
  blockchain: "crypto",
  "defi": "crypto",
  bitcoin: "crypto",
  btc: "crypto",
  ethereum: "crypto",
  eth: "crypto",
  "web3": "crypto",
  token: "crypto",
  coin: "crypto",
  nft: "crypto",
  altcoin: "crypto",

  // Sports
  sports: "sports",
  nba: "sports",
  nfl: "sports",
  nhl: "sports",
  ufc: "sports",
  mma: "sports",
  soccer: "sports",
  football: "sports",
  basketball: "sports",
  baseball: "sports",
  hockey: "sports",
  tennis: "sports",
  golf: "sports",
  boxing: "sports",
  wrestling: "sports",
  olympics: "sports",
  "super bowl": "sports",
  "world cup": "sports",
  ncaa: "sports",
  "march madness": "sports",
  "champions league": "sports",
  "premier league": "sports",
  "nba finals": "sports",
  "world series": "sports",
  "stanley cup": "sports",

  // Business
  business: "business",
  finance: "business",
  economics: "business",
  trading: "business",
  stocks: "business",
  "stock market": "business",
  "federal reserve": "business",
  "fed": "business",
  "interest rates": "business",
  inflation: "business",
  gdp: "business",
  recession: "business",
  economy: "business",

  // Geopolitics
  geopolitics: "geopolitics",
  "russia": "geopolitics",
  "russia-ukraine": "geopolitics",
  ukraine: "geopolitics",
  "middle east": "geopolitics",
  israel: "geopolitics",
  iran: "geopolitics",
  war: "geopolitics",
  "nuclear": "geopolitics",
  "north korea": "geopolitics",
  invasion: "geopolitics",
  "military": "geopolitics",
  "defense": "geopolitics",

  // Technology
  technology: "technology",
  tech: "technology",
  ai: "technology",
  "artificial intelligence": "technology",
  "machine learning": "technology",
  "tech company": "technology",
  apple: "technology",
  google: "technology",
  microsoft: "technology",
  amazon: "technology",
  meta: "technology",
  tesla: "technology",
  spacex: "technology",
  elon: "technology",

  // Entertainment
  entertainment: "entertainment",
  movies: "entertainment",
  film: "entertainment",
  oscar: "entertainment",
  "academy awards": "entertainment",
  music: "entertainment",
  grammy: "entertainment",
  tv: "entertainment",
  television: "entertainment",
  streaming: "entertainment",
  netflix: "entertainment",
  celebrity: "entertainment",

  // Science
  science: "science",
  space: "science",
  nasa: "science",
  climate: "science",
  "climate change": "science",
  weather: "science",
  health: "science",
  medical: "science",
  pandemic: "science",
  virus: "science",
  research: "science",
  discovery: "science",
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
  { id: "politics", label: "Politics", emoji: "🏛️" },
  { id: "geopolitics", label: "Geopolitics", emoji: "🌍" },
  { id: "business", label: "Business", emoji: "💰" },
  { id: "crypto", label: "Crypto", emoji: "₿" },
  { id: "technology", label: "Tech", emoji: "💻" },
  { id: "sports", label: "Sports", emoji: "⚽" },
  { id: "entertainment", label: "Entertainment", emoji: "🎬" },
  { id: "science", label: "Science", emoji: "🔬" },
  { id: "other", label: "Other", emoji: "📊" },
];
