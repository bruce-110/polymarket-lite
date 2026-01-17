"use client";

import { createContext, useContext, useEffect, useState, useCallback, useMemo, ReactNode } from "react";

type Language = "en" | "zh";

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Header
    title: "Polymarket Lite",
    subtitle: "Prediction Markets",
    refresh: "Refresh",
    favorites: "Favorites",
    allMarkets: "All Markets",

    // Categories
    "category.all": "Trending",
    "category.politics": "Politics",
    "category.geopolitics": "Geopolitics",
    "category.business": "Business",
    "category.stocks": "Stocks",
    "category.crypto": "Crypto",
    "category.technology": "Technology",
    "category.ai": "AI",
    "category.sports": "Sports",
    "category.entertainment": "Entertainment",
    "category.gaming": "Gaming",
    "category.science": "Science",
    "category.climate": "Climate",
    "category.health": "Health",
    "category.society": "Society",
    "category.other": "Other",

    // Headlines
    hotPick: "HOT PICK",

    // Search
    searchPlaceholder: "Search markets...",

    // Sort
    "sort.volume": "Volume",
    "sort.probability": "Probability",
    "sort.newest": "Newest",

    // Empty states
    noMarkets: "No Markets Found",
    noMarketsDesc: "Try selecting a different category or check back later.",
    noFavorites: "No Favorite Markets",
    noFavoritesDesc: "Mark some markets as favorites to see them here.",

    // Footer
    footer: "Prediction Markets, Redefined • Data from Polymarket API",

    // Loading
    loading: "Loading...",
  },
  zh: {
    // Header
    title: "Polymarket Lite",
    subtitle: "预测市场",
    refresh: "刷新",
    favorites: "收藏",
    allMarkets: "全部市场",

    // Categories
    "category.all": "热门",
    "category.politics": "政治",
    "category.geopolitics": "地缘政治",
    "category.business": "商业",
    "category.stocks": "股市",
    "category.crypto": "加密货币",
    "category.technology": "科技",
    "category.ai": "人工智能",
    "category.sports": "体育",
    "category.entertainment": "娱乐",
    "category.gaming": "游戏",
    "category.science": "科学",
    "category.climate": "气候",
    "category.health": "健康",
    "category.society": "社会",
    "category.other": "其他",

    // Headlines
    hotPick: "热门推荐",

    // Search
    searchPlaceholder: "搜索市场...",

    // Sort
    "sort.volume": "交易量",
    "sort.probability": "概率",
    "sort.newest": "最新",

    // Empty states
    noMarkets: "未找到市场",
    noMarketsDesc: "尝试选择不同的分类或稍后再试。",
    noFavorites: "暂无收藏市场",
    noFavoritesDesc: "将一些市场标记为收藏即可在此查看。",

    // Footer
    footer: "预测市场重新定义 • 数据来自 Polymarket API",

    // Loading
    loading: "加载中...",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");
  const [mounted, setMounted] = useState(false);

  // Load language from localStorage on mount
  useEffect(() => {
    // Default to English, only load saved language if explicitly set
    const savedLanguage = localStorage.getItem("language") as Language | null;
    if (savedLanguage === "zh") {
      setLanguage("zh");
    } else {
      // Default to English
      setLanguage("en");
      localStorage.setItem("language", "en");
    }
    setMounted(true);
  }, []);

  // Save language to localStorage
  useEffect(() => {
    if (mounted) {
      localStorage.setItem("language", language);
    }
  }, [language, mounted]);

  // Memoize toggleLanguage to prevent unnecessary re-renders
  const toggleLanguage = useCallback(() => {
    setLanguage((prev) => (prev === "en" ? "zh" : "en"));
  }, []);

  // Memoize t function to prevent unnecessary re-renders
  const t = useCallback((key: string): string => {
    return translations[language][key as keyof typeof translations.en] || key;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    return { language: "en" as Language, toggleLanguage: () => {}, t: (key: string) => key };
  }
  return context;
}
