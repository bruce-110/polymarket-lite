"use client";

import { useState, useMemo } from "react";
import { Market, Category, CATEGORIES, getCategoryFromTags } from "@/types/market";
import { useMarkets } from "@/hooks/useMarkets";
import { useFavorites } from "@/hooks/useFavorites";
import { useLanguage } from "@/contexts/LanguageContext";
import { MarketCard } from "@/components/MarketCard";
import { MarketCardSkeleton, HeroSkeleton } from "@/components/MarketCardSkeleton";
import { BettingDrawer } from "@/components/BettingDrawer";
import { SearchBar } from "@/components/SearchBar";
import { SortSelector } from "@/components/SortSelector";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageToggle } from "@/components/LanguageToggle";
import { TrendingUp, RefreshCw, Newspaper, Star } from "lucide-react";
import { SortOption } from "@/lib/theme";

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<Category>("all");
  const [selectedMarket, setSelectedMarket] = useState<Market | null>(null);
  const [selectedOutcome, setSelectedOutcome] = useState<"yes" | "no" | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("volume");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  const { markets, isLoading, isValidating, error, mutate } = useMarkets();
  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  const { t, language } = useLanguage();

  // Select top 2 markets for headlines (primary and secondary)
  const headlineMarkets = useMemo(() => {
    if (markets.length === 0) return { primary: null, secondary: null };

    // Score each market for headline suitability
    const scoredMarkets = markets.map((market) => {
      let score = 0;

      // 1. Volume score (higher is better) - max 40 points
      const volumeScore = Math.min((market.volumeScore || 0) / 1000000 * 40, 40);

      // 2. Controversy score (closer to 50% is more controversial) - max 30 points
      const yesProb = market.yesProbability;
      const distanceFrom50 = Math.abs(yesProb - 50);
      const controversyScore = Math.max(30 - distanceFrom50 * 0.6, 0);

      // 3. Engagement score (moderate probability range) - max 20 points
      const isEngagingRange = yesProb >= 20 && yesProb <= 80;
      const engagementScore = isEngagingRange ? 20 : 10;

      // 4. Freshness score (based on ID recency) - max 10 points
      const idNum = parseInt(market.id.replace(/\D/g, '')) || 0;
      const freshnessScore = Math.min(idNum / 100000000 * 10, 10);

      score = volumeScore + controversyScore + engagementScore + freshnessScore;

      return { market, score };
    });

    // Sort by score
    scoredMarkets.sort((a, b) => b.score - a.score);

    const primary = scoredMarkets[0]?.market || null;
    const secondary = scoredMarkets[1]?.market || null;

    if (primary) {
      console.log(`🏆 Primary headline: "${primary.question}" (score: ${scoredMarkets[0]?.score.toFixed(1)})`);
    }
    if (secondary) {
      console.log(`⭐ Secondary headline: "${secondary.question}" (score: ${scoredMarkets[1]?.score.toFixed(1)})`);
    }

    return { primary, secondary };
  }, [markets]);

  const filteredAndSortedMarkets = useMemo(() => {
    let result = [...markets];

    // Exclude headline markets from the list to avoid duplication
    const headlineIds = new Set([
      headlineMarkets.primary?.id,
      headlineMarkets.secondary?.id,
    ].filter(Boolean));
    result = result.filter(m => !headlineIds.has(m.id));

    // Filter by category
    if (selectedCategory !== "all") {
      result = result.filter((m) => {
        const marketCategory = getCategoryFromTags(m.tags);
        if (marketCategory === selectedCategory) return true;

        // Fallback: check if any tag partially matches category
        const normalizedTags = m.tags.map(t => t.toLowerCase());
        const categoryKeywords: Record<Category, string[]> = {
          all: [],
          politics: ["politics", "election", "trump", "biden", "congress", "senate", "president", "government", "democrat", "republican", "white house"],
          geopolitics: ["russia", "ukraine", "war", "israel", "iran", "middle east", "nuclear", "north korea", "invasion", "military", "defense", "nato"],
          business: ["business", "finance", "economy", "trading", "federal reserve", "fed", "interest rates", "inflation", "gdp", "recession", "banking", "wall street"],
          stocks: ["stocks", "stock market", "s&p 500", "nasdaq", "dow jones", "apple", "microsoft", "google", "amazon", "meta", "tesla", "nvidia", "earnings"],
          crypto: ["crypto", "bitcoin", "btc", "ethereum", "eth", "defi", "blockchain", "token", "coin", "nft", "web3", "altcoin"],
          technology: ["tech", "technology", "tech company", "spacex", "elon", "musk", "innovation", "startup", "big tech", "software", "hardware"],
          ai: ["ai", "artificial intelligence", "machine learning", "deep learning", "chatgpt", "openai", "agl", "automation", "robotics", "llm", "generative ai"],
          sports: ["nba", "nfl", "nhl", "ufc", "mma", "soccer", "football", "basketball", "baseball", "hockey", "tennis", "golf", "boxing", "wrestling", "olympics", "super bowl", "world cup", "ncaa", "march madness", "champions league", "premier league"],
          entertainment: ["movies", "film", "oscar", "academy awards", "music", "grammy", "tv", "television", "streaming", "netflix", "celebrity", "hollywood", "box office"],
          gaming: ["gaming", "esports", "video games", "playstation", "xbox", "nintendo", "steam", "twitch", "gaming industry", "game awards"],
          science: ["space", "nasa", "spacex", "astronomy", "physics", "research", "discovery", "space exploration", "mars", "moon"],
          climate: ["climate", "climate change", "weather", "environment", "temperature", "global warming", "carbon", "energy", "renewable energy"],
          health: ["health", "medical", "pandemic", "virus", "disease", "vaccine", "fda", "covid", "public health", "medicine"],
          society: ["society", "culture", "social", "social media", "twitter", "facebook", "tiktok", "influencers", "trends", "viral", "internet"],
          other: []
        };

        const keywords = categoryKeywords[selectedCategory] || [];
        return keywords.some(keyword =>
          normalizedTags.some(tag => tag.includes(keyword))
        );
      });
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter((m) =>
        m.question.toLowerCase().includes(query) ||
        m.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Filter by favorites
    if (showFavoritesOnly) {
      result = result.filter((m) => favorites.has(m.id));
    }

    // Sort markets
    result.sort((a, b) => {
      switch (sortBy) {
        case "volume":
          return (b.volumeScore || 0) - (a.volumeScore || 0);
        case "probability":
          return b.yesProbability - a.yesProbability;
        case "newest":
          return b.id.localeCompare(a.id);
        default:
          return 0;
      }
    });

    return result;
  }, [markets, selectedCategory, searchQuery, sortBy, favorites, showFavoritesOnly]);

  const handleBetClick = (market: Market, outcome: "yes" | "no") => {
    setSelectedMarket(market);
    setSelectedOutcome(outcome);
  };

  const handleCloseDrawer = () => {
    setSelectedMarket(null);
    setSelectedOutcome(null);
  };

  const handleRefresh = () => {
    mutate();
  };

  return (
    <div className="min-h-screen transition-colors duration-300" style={{ backgroundColor: 'var(--bg-primary, #fcfaf2)' }}>
      {/* Header - Minimal and Elegant */}
      <header className="sticky top-0 z-50 border-b backdrop-blur-sm" style={{ backgroundColor: 'var(--header-bg, rgba(252, 250, 242, 0.95))', borderColor: 'var(--border-color, #e8e4dc)' }}>
        <div className="container mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--logo-bg, #3d6b4f)' }}>
                <Newspaper className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold" style={{ fontFamily: 'Playfair Display, Georgia, serif', color: 'var(--text-primary, #333333)' }}>
                  Polymarket Lite
                </h1>
                <p className="text-xs" style={{ color: 'var(--text-secondary, #888)', fontFamily: 'Inter, sans-serif' }}>
                  Prediction Markets
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleRefresh}
                className="px-4 py-2 text-sm font-medium transition-all hover:opacity-80 disabled:opacity-50"
                style={{ border: '1px solid var(--border-color, #d4d4d4)', borderRadius: '2px', color: 'var(--text-secondary, #666)' }}
                disabled={isLoading || isValidating}
                title={t("refresh")}
              >
                <RefreshCw className={`h-4 w-4 ${isValidating ? "animate-spin" : ""}`} />
              </button>

              <LanguageToggle />
              <ThemeToggle />

              <button
                onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                className={`px-4 py-2 text-sm font-bold transition-all hover:shadow-md active:scale-95 flex items-center gap-2`}
                style={{
                  backgroundColor: showFavoritesOnly ? '#FFD700' : 'var(--button-secondary, #ffffff)',
                  color: showFavoritesOnly ? '#000000' : 'var(--text-primary, #333333)',
                  border: showFavoritesOnly ? '2px solid #FFD700' : '1px solid var(--border-color, #e8e4dc)',
                  borderRadius: '2px',
                }}
              >
                <Star className="h-4 w-4" style={{ fill: showFavoritesOnly ? '#000000' : 'none' }} />
                <span className="hidden sm:inline">{showFavoritesOnly ? t("allMarkets") : t("favorites")}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-10 space-y-12">
        {/* Primary Headline Section - Large */}
        {isLoading ? (
          <HeroSkeleton />
        ) : headlineMarkets.primary ? (
          <section className="flex flex-col md:flex-row gap-6 md:gap-8 items-start" style={{ borderBottom: '2px solid var(--hero-border, #1a1a1a)', paddingBottom: '2rem' }}>
            {/* Left: Text Content */}
            <div className="flex-1 space-y-4 md:space-y-5">
              {/* Category Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 text-xs md:text-sm font-medium" style={{ backgroundColor: 'rgba(61, 107, 79, 0.1)', border: '1px solid #3d6b4f', borderRadius: '2px', color: '#3d6b4f' }}>
                <TrendingUp className="h-4 w-4" />
                <span style={{ fontFamily: 'Inter, sans-serif', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: '600' }}>
                  {getCategoryFromTags(headlineMarkets.primary.tags)}
                </span>
              </div>

              {/* Massive Headline */}
              <h1
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
                style={{
                  fontFamily: 'Playfair Display, Georgia, serif',
                  color: 'var(--text-primary, #1a1a1a)',
                  letterSpacing: '-0.03em',
                  lineHeight: '1.1',
                  display: '-webkit-box',
                  WebkitLineClamp: 4,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {headlineMarkets.primary.question}
              </h1>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 md:gap-3">
                {headlineMarkets.primary.tags.slice(0, 4).map((tag, i) => (
                  <span
                    key={i}
                    className="text-xs md:text-sm font-medium"
                    style={{ color: 'var(--text-secondary, #888)', fontFamily: 'Inter, sans-serif', borderBottom: '1px dotted var(--border-light, #bbb)' }}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => handleBetClick(headlineMarkets.primary, "yes")}
                  className="flex-1 md:flex-none px-4 md:px-6 h-11 md:h-12 font-semibold text-white transition-all hover:shadow-lg active:scale-95"
                  style={{ backgroundColor: '#3d6b4f', fontFamily: 'Inter, sans-serif', borderRadius: '2px', fontSize: '0.95rem', boxShadow: '0 2px 6px rgba(61, 107, 79, 0.2)' }}
                >
                  YES {headlineMarkets.primary.yesProbability}%
                </button>

                <button
                  onClick={() => handleBetClick(headlineMarkets.primary, "no")}
                  className="flex-1 md:flex-none px-4 md:px-6 h-11 md:h-12 font-semibold text-white transition-all hover:shadow-lg active:scale-95"
                  style={{ backgroundColor: '#c25e3e', fontFamily: 'Inter, sans-serif', borderRadius: '2px', fontSize: '0.95rem', boxShadow: '0 2px 6px rgba(194, 94, 62, 0.2)' }}
                >
                  NO {headlineMarkets.primary.noProbability}%
                </button>
              </div>
            </div>

            {/* Right: Medium Image */}
            <div className="flex-shrink-0 mx-auto md:mx-0">
              <div
                className="overflow-hidden w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64"
                style={{ borderRadius: '4px', border: '1px solid var(--border-color, #d4d4d4)' }}
              >
                <img
                  src={headlineMarkets.primary.image}
                  alt={headlineMarkets.primary.question}
                  className="w-full h-full object-cover transition-all duration-500"
                  style={{
                    filter: 'grayscale(30%) sepia(20%) contrast(1.05) brightness(0.95)',
                    mixBlendMode: 'multiply',
                  }}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    (target.parentElement! as HTMLDivElement).style.background = 'var(--image-placeholder, #f5f3ef)';
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.filter = 'grayscale(0%) sepia(0%) contrast(1) brightness(1)';
                    e.currentTarget.style.mixBlendMode = 'normal';
                    e.currentTarget.style.transform = 'scale(1.02)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.filter = 'grayscale(30%) sepia(20%) contrast(1.05) brightness(0.95)';
                    e.currentTarget.style.mixBlendMode = 'multiply';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                />
              </div>
            </div>
          </section>
        ) : null}

        {/* Secondary Headline Section - Medium */}
        {!isLoading && headlineMarkets.secondary ? (
          <section className="flex flex-col md:flex-row gap-4 md:gap-6 items-start p-4 md:p-6 rounded-lg" style={{ backgroundColor: 'var(--card-bg, rgba(255,255,255,0.5))', border: '1px solid var(--border-color, #e8e4dc)' }}>
            {/* Left: Text Content */}
            <div className="flex-1 space-y-3">
              {/* Category Badge */}
              <div className="inline-flex items-center gap-2 px-2 py-1 text-xs font-medium" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', border: '1px solid #3b82f6', borderRadius: '2px', color: '#3b82f6' }}>
                <Star className="h-3 w-3" />
                <span style={{ fontFamily: 'Inter, sans-serif', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '600' }}>
                  HOT PICK
                </span>
              </div>

              {/* Headline */}
              <h2
                className="text-xl sm:text-2xl md:text-3xl font-bold leading-tight"
                style={{
                  fontFamily: 'Playfair Display, Georgia, serif',
                  color: 'var(--text-primary, #1a1a1a)',
                  letterSpacing: '-0.02em',
                  lineHeight: '1.2',
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {headlineMarkets.secondary.question}
              </h2>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {headlineMarkets.secondary.tags.slice(0, 3).map((tag, i) => (
                  <span
                    key={i}
                    className="text-xs font-medium"
                    style={{ color: 'var(--text-secondary, #888)', fontFamily: 'Inter, sans-serif', borderBottom: '1px dotted var(--border-light, #bbb)' }}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => handleBetClick(headlineMarkets.secondary, "yes")}
                  className="flex-1 md:flex-none px-3 md:px-5 h-9 md:h-10 font-semibold text-white transition-all hover:shadow-lg active:scale-95"
                  style={{ backgroundColor: '#3b82f6', fontFamily: 'Inter, sans-serif', borderRadius: '2px', fontSize: '0.9rem', boxShadow: '0 2px 4px rgba(59, 130, 246, 0.2)' }}
                >
                  YES {headlineMarkets.secondary.yesProbability}%
                </button>

                <button
                  onClick={() => handleBetClick(headlineMarkets.secondary, "no")}
                  className="flex-1 md:flex-none px-3 md:px-5 h-9 md:h-10 font-semibold text-white transition-all hover:shadow-lg active:scale-95"
                  style={{ backgroundColor: '#ef4444', fontFamily: 'Inter, sans-serif', borderRadius: '2px', fontSize: '0.9rem', boxShadow: '0 2px 4px rgba(239, 68, 68, 0.2)' }}
                >
                  NO {headlineMarkets.secondary.noProbability}%
                </button>
              </div>
            </div>

            {/* Right: Small Image */}
            <div className="flex-shrink-0 mx-auto md:mx-0">
              <div
                className="overflow-hidden w-32 h-32 sm:w-40 sm:h-40"
                style={{ borderRadius: '4px', border: '1px solid var(--border-color, #d4d4d4)' }}
              >
                <img
                  src={headlineMarkets.secondary.image}
                  alt={headlineMarkets.secondary.question}
                  className="w-full h-full object-cover transition-all duration-500"
                  style={{
                    filter: 'grayscale(30%) sepia(20%) contrast(1.05) brightness(0.95)',
                    mixBlendMode: 'multiply',
                  }}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    (target.parentElement! as HTMLDivElement).style.background = 'var(--image-placeholder, #f5f3ef)';
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.filter = 'grayscale(0%) sepia(0%) contrast(1) brightness(1)';
                    e.currentTarget.style.mixBlendMode = 'normal';
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.filter = 'grayscale(30%) sepia(20%) contrast(1.05) brightness(0.95)';
                    e.currentTarget.style.mixBlendMode = 'multiply';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                />
              </div>
            </div>
          </section>
        ) : null}

        {/* Error State - Enhanced UI */}
        {error && (
          <div className="rounded-lg p-8 md:p-12 text-center" style={{ border: '1px solid var(--border-color, #e8e4dc)', backgroundColor: 'var(--card-bg, #ffffff)', maxWidth: '500px', margin: '0 auto' }}>
            <div className="mb-4" style={{ fontSize: '3rem' }}>⚠️</div>
            <h2 className="text-xl md:text-2xl font-bold mb-3" style={{ fontFamily: 'Playfair Display, Georgia, serif', color: 'var(--text-primary, #1a1a1a)' }}>
              Network Error
            </h2>
            <p className="text-sm md:text-base mb-6" style={{ color: 'var(--text-secondary, #666)', fontFamily: 'Inter, sans-serif', lineHeight: '1.5' }}>
              Unable to load market data. Please check your connection and try again.
            </p>
            <button
              onClick={handleRefresh}
              className="px-6 py-3 font-semibold text-white transition-all hover:shadow-md active:scale-95"
              style={{ backgroundColor: '#3d6b4f', fontFamily: 'Inter, sans-serif', borderRadius: '2px', fontSize: '1rem' }}
            >
              Retry Now
            </button>
          </div>
        )}

        {/* Search and Sort Bar */}
        <section className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="flex-1 w-full">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search markets..."
            />
          </div>
          <div className="w-full sm:w-auto">
            <SortSelector value={sortBy} onChange={setSortBy} />
          </div>
        </section>

        {/* Category Filters - Newspaper Navigation */}
        <section style={{ borderBottom: '1px solid var(--border-color, #d4d4d4)', paddingBottom: '1rem' }}>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {CATEGORIES.map((cat) => {
              const displayLabel = language === "zh" ? cat.label : cat.label;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`whitespace-nowrap px-5 py-2 font-medium transition-all ${
                    selectedCategory === cat.id
                      ? "text-white"
                      : "hover:bg-white/50"
                  }`}
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    backgroundColor: selectedCategory === cat.id ? 'var(--category-active, #1a1a1a)' : 'transparent',
                    border: selectedCategory === cat.id ? 'none' : '1px solid transparent',
                    borderRadius: '2px',
                    color: selectedCategory === cat.id ? '#ffffff' : 'var(--text-secondary, #666)',
                    letterSpacing: '0.02em',
                  }}
                  onMouseEnter={(e) => {
                    if (selectedCategory !== cat.id) {
                      e.currentTarget.style.borderBottom = '1px solid var(--category-active, #1a1a1a)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedCategory !== cat.id) {
                      e.currentTarget.style.borderBottom = '1px solid transparent';
                    }
                  }}
                >
                  <span className="mr-2">{cat.emoji}</span>
                  <span className="text-sm" style={{ fontWeight: selectedCategory === cat.id ? '600' : '400' }}>{displayLabel}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Market Cards Grid - 2 Column Layout for Better Readability */}
        {isLoading ? (
          <section className="grid md:grid-cols-1 lg:grid-cols-2 gap-0">
            {Array.from({ length: 6 }).map((_, i) => (
              <MarketCardSkeleton key={i} />
            ))}
          </section>
        ) : (
          <section className="grid md:grid-cols-1 lg:grid-cols-2 gap-0">
            {filteredAndSortedMarkets.map((market) => (
              <div key={market.id} className="relative">
                <button
                  onClick={() => toggleFavorite(market.id)}
                  className="absolute top-4 right-4 z-10"
                  style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
                >
                  <Star
                    className="h-5 w-5 transition-all hover:scale-110"
                    style={{
                      fill: isFavorite(market.id) ? '#FFD700' : 'none',
                      color: isFavorite(market.id) ? '#FFD700' : 'var(--text-tertiary, #ccc)',
                    }}
                  />
                </button>
                <MarketCard market={market} onBetClick={handleBetClick} />
              </div>
            ))}
          </section>
        )}

        {!isLoading && filteredAndSortedMarkets.length === 0 && (
          <div className="text-center py-16 md:py-20">
            <div className="mb-4" style={{ fontSize: '3rem' }}>📭</div>
            <p className="text-lg md:text-xl font-medium mb-2" style={{ color: 'var(--text-tertiary, #999)', fontFamily: 'Playfair Display, Georgia, serif' }}>
              {showFavoritesOnly ? "No Favorite Markets" : "No Markets Found"}
            </p>
            <p className="text-sm" style={{ color: 'var(--text-tertiary, #aaa)', fontFamily: 'Inter, sans-serif' }}>
              {showFavoritesOnly
                ? "Mark some markets as favorites to see them here."
                : "Try selecting a different category or check back later."}
            </p>
          </div>
        )}
      </main>

      {/* Betting Drawer */}
      <BettingDrawer
        open={!!selectedMarket && !!selectedOutcome}
        onClose={handleCloseDrawer}
        market={selectedMarket}
        outcome={selectedOutcome}
      />

      {/* Footer - Minimal */}
      <footer className="border-t mt-20 py-12" style={{ borderColor: 'var(--border-color, #e8e4dc)', backgroundColor: 'var(--footer-bg, #fefefa)' }}>
        <div className="container mx-auto px-6 text-center">
          <p className="text-sm font-medium mb-2" style={{ fontFamily: 'Playfair Display, Georgia, serif', color: 'var(--text-primary, #333333)' }}>
            Polymarket Lite
          </p>
          <p className="text-xs" style={{ fontFamily: 'Inter, sans-serif', color: 'var(--text-tertiary, #999)' }}>
            Prediction Markets, Redefined • Data from Polymarket API
          </p>
        </div>
      </footer>
    </div>
  );
}
