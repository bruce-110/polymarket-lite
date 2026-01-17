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
  volumeScore?: number; // For sorting
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
  | "geopolitics"
  | "business"
  | "crypto"
  | "stocks"
  | "technology"
  | "ai"
  | "sports"
  | "entertainment"
  | "gaming"
  | "science"
  | "climate"
  | "health"
  | "society"
  | "other";

export const CATEGORY_MAP: Record<string, Category> = {
  // Politics & Government
  politics: "politics",
  "u.s. politics": "politics",
  "u.s. 2024 elections": "politics",
  "u.s. 2026 elections": "politics",
  elections: "politics",
  trump: "politics",
  biden: "politics",
  congress: "politics",
  senate: "politics",
  president: "politics",
  government: "politics",
  democrat: "politics",
  republican: "politics",
  "white house": "politics",

  // Geopolitics & War
  geopolitics: "geopolitics",
  russia: "geopolitics",
  "russia-ukraine": "geopolitics",
  ukraine: "geopolitics",
  "middle east": "geopolitics",
  israel: "geopolitics",
  iran: "geopolitics",
  war: "geopolitics",
  nuclear: "geopolitics",
  "north korea": "geopolitics",
  invasion: "geopolitics",
  military: "geopolitics",
  defense: "geopolitics",
  "nato": "geopolitics",

  // Business & Economy
  business: "business",
  finance: "business",
  economics: "business",
  trading: "business",
  "federal reserve": "business",
  fed: "business",
  "interest rates": "business",
  inflation: "business",
  gdp: "business",
  recession: "business",
  economy: "business",
  banking: "business",
  "wall street": "business",

  // Stock Market
  stocks: "stocks",
  "stock market": "stocks",
  "s&p 500": "stocks",
  "nasdaq": "stocks",
  "dow jones": "stocks",
  apple: "stocks",
  microsoft: "stocks",
  google: "stocks",
  amazon: "stocks",
  meta: "stocks",
  tesla: "stocks",
  nvidia: "stocks",
  earnings: "stocks",

  // Crypto
  crypto: "crypto",
  blockchain: "crypto",
  defi: "crypto",
  bitcoin: "crypto",
  btc: "crypto",
  ethereum: "crypto",
  eth: "crypto",
  web3: "crypto",
  token: "crypto",
  coin: "crypto",
  nft: "crypto",
  altcoin: "crypto",
  "crypto market": "crypto",

  // Technology
  technology: "technology",
  tech: "technology",
  "tech company": "technology",
  spacex: "technology",
  elon: "technology",
  musk: "technology",
  innovation: "technology",
  startup: "technology",
  "big tech": "technology",
  software: "technology",
  hardware: "technology",

  // AI & Machine Learning
  ai: "ai",
  "artificial intelligence": "ai",
  "machine learning": "ai",
  "deep learning": "ai",
  chatgpt: "ai",
  openai: "ai",
  "agl": "ai",
  automation: "ai",
  robotics: "ai",
  "llm": "ai",
  "generative ai": "ai",

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
  "wimbledon": "sports",

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
  hollywood: "entertainment",
  "box office": "entertainment",

  // Gaming
  gaming: "gaming",
  esports: "gaming",
  "video games": "gaming",
  playstation: "gaming",
  xbox: "gaming",
  nintendo: "gaming",
  steam: "gaming",
  twitch: "gaming",
  "gaming industry": "gaming",
  "game awards": "gaming",

  // Science & Space
  science: "science",
  space: "science",
  nasa: "science",
  astronomy: "science",
  physics: "science",
  research: "science",
  discovery: "science",
  "space exploration": "science",
  mars: "science",
  moon: "science",

  // Climate & Environment
  climate: "climate",
  "climate change": "climate",
  weather: "climate",
  environment: "climate",
  temperature: "climate",
  "global warming": "climate",
  "carbon": "climate",
  energy: "climate",
  "renewable energy": "climate",

  // Health & Medicine
  health: "health",
  medical: "health",
  pandemic: "health",
  virus: "health",
  disease: "health",
  vaccine: "health",
  fda: "health",
  "covid": "health",
  "public health": "health",
  medicine: "health",

  // Society & Culture
  society: "society",
  culture: "society",
  social: "society",
  "social media": "society",
  twitter: "society",
  facebook: "society",
  tiktok: "society",
  influencers: "society",
  trends: "society",
  viral: "society",
  internet: "society",
};

export function getCategoryFromTags(tags: string[]): Category {
  if (!tags || tags.length === 0) return "other";

  const normalizedTags = tags.map((t) => t.toLowerCase());

  // Check each tag against CATEGORY_MAP
  for (const tag of normalizedTags) {
    if (CATEGORY_MAP[tag]) {
      return CATEGORY_MAP[tag];
    }
  }

  // Try partial matching for tags that contain keywords
  for (const tag of normalizedTags) {
    for (const [keyword, category] of Object.entries(CATEGORY_MAP)) {
      if (tag.includes(keyword) || keyword.includes(tag)) {
        return category;
      }
    }
  }

  return "other";
}

export const CATEGORIES: { id: Category; label: string; emoji: string; description: string }[] = [
  { id: "all", label: "Trending", emoji: "🔥", description: "最热门的预测市场" },
  { id: "politics", label: "政治", emoji: "🏛️", description: "美国政治、选举、政府" },
  { id: "geopolitics", label: "地缘政治", emoji: "🌍", description: "国际关系、战争、冲突" },
  { id: "business", label: "商业", emoji: "💼", description: "经济、金融、商业" },
  { id: "stocks", label: "股市", emoji: "📈", description: "股票、上市公司、财报" },
  { id: "crypto", label: "加密货币", emoji: "₿", description: "比特币、以太坊、DeFi" },
  { id: "technology", label: "科技", emoji: "💻", description: "大型科技公司、创新" },
  { id: "ai", label: "人工智能", emoji: "🤖", description: "AI、机器学习、ChatGPT" },
  { id: "sports", label: "体育", emoji: "⚽", description: "NBA、NFL、足球等体育赛事" },
  { id: "entertainment", label: "娱乐", emoji: "🎬", description: "电影、音乐、明星" },
  { id: "gaming", label: "游戏", emoji: "🎮", description: "电子竞技、游戏行业" },
  { id: "science", label: "科学", emoji: "🔬", description: "太空探索、科研发现" },
  { id: "climate", label: "气候", emoji: "🌡️", description: "气候变化、环境" },
  { id: "health", label: "健康", emoji: "🏥", description: "医疗健康、疫情" },
  { id: "society", label: "社会", emoji: "👥", description: "社会文化、网络趋势" },
  { id: "other", label: "其他", emoji: "📊", description: "其他分类" },
];

// Trending subcategories for each main category
export const TRENDING_SUBCATEGORIES: Record<Category, string[]> = {
  all: [],
  politics: ["选举", "特朗普", "拜登", "国会", "最高法院"],
  geopolitics: ["俄乌战争", "以伊冲突", "北约", "中东"],
  business: ["美联储", "通胀", "GDP", "经济衰退"],
  stocks: ["科技股", "财报季", "IPO", "股价"],
  crypto: ["比特币", "以太坊", "DeFi", "NFT"],
  technology: ["大型科技", "初创公司", "创新", "IPO"],
  ai: ["ChatGPT", "OpenAI", "AGI", "自动化"],
  sports: ["NBA", "NFL", "超级碗", "欧冠"],
  entertainment: ["奥斯卡", "格莱美", "Netflix", "明星"],
  gaming: ["电子竞技", "Steam", "主机", "独立游戏"],
  science: ["NASA", "火星", "太空探索", "科研"],
  climate: ["全球变暖", "极端天气", "碳中和", "清洁能源"],
  health: ["疫情", "疫苗", "FDA", "公共健康"],
  society: ["社交媒体", "网红", "热门话题", "病毒式传播"],
  other: [],
};
