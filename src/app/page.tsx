"use client";

import { useState, useMemo } from "react";
import { Market, Category, CATEGORIES, getCategoryFromTags } from "@/types/market";
import { useMarkets } from "@/hooks/useMarkets";
import { MarketCard } from "@/components/MarketCard";
import { MarketCardSkeleton, HeroSkeleton } from "@/components/MarketCardSkeleton";
import { BettingDrawer } from "@/components/BettingDrawer";
import { TrendingUp, RefreshCw, Newspaper } from "lucide-react";

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<Category>("all");
  const [selectedMarket, setSelectedMarket] = useState<Market | null>(null);
  const [selectedOutcome, setSelectedOutcome] = useState<"yes" | "no" | null>(null);

  const { markets, isLoading, isValidating, error, mutate } = useMarkets();

  const heroMarket = useMemo(() => {
    if (markets.length === 0) return null;
    return markets[0];
  }, [markets]);

  const filteredMarkets = useMemo(() => {
    if (selectedCategory === "all") return markets;

    // More robust filtering - check if any tag contains the category name
    return markets.filter((m) => {
      const marketCategory = getCategoryFromTags(m.tags);

      // Direct match
      if (marketCategory === selectedCategory) return true;

      // Fallback: check if any tag partially matches category
      const normalizedTags = m.tags.map(t => t.toLowerCase());
      const categoryKeywords: Record<Category, string[]> = {
        all: [],
        politics: ["politics", "election", "trump", "biden", "congress", "senate", "president", "government"],
        crypto: ["crypto", "bitcoin", "btc", "ethereum", "eth", "defi", "blockchain", "token", "coin", "nft"],
        sports: ["nba", "nfl", "nhl", "ufc", "mma", "soccer", "football", "basketball", "baseball", "hockey", "tennis", "golf", "boxing", "wrestling", "olympics", "super bowl", "world cup", "ncaa", "march madness"],
        business: ["business", "finance", "economy", "stock", "market", "trading", "federal reserve", "economics", "stocks"],
        other: []
      };

      const keywords = categoryKeywords[selectedCategory] || [];
      return keywords.some(keyword =>
        normalizedTags.some(tag => tag.includes(keyword))
      );
    });
  }, [markets, selectedCategory]);

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
    <div className="min-h-screen" style={{ backgroundColor: '#fcfaf2' }}>
      {/* Header - Minimal and Elegant */}
      <header className="sticky top-0 z-50 border-b" style={{ backgroundColor: 'rgba(252, 250, 242, 0.95)', borderColor: '#e8e4dc' }}>
        <div className="container mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#3d6b4f' }}>
                <Newspaper className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold" style={{ fontFamily: 'Playfair Display, Georgia, serif', color: '#333333' }}>
                  Polymarket Lite
                </h1>
                <p className="text-xs" style={{ color: '#888', fontFamily: 'Inter, sans-serif' }}>
                  Prediction Markets
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleRefresh}
                className="px-4 py-2 text-sm font-medium transition-all hover:bg-white/50 disabled:opacity-50"
                style={{ border: '1px solid #d4d4d4', borderRadius: '2px', color: '#666' }}
                disabled={isLoading || isValidating}
              >
                <RefreshCw className={`h-4 w-4 ${isValidating ? "animate-spin" : ""}`} />
              </button>
              {/* HANKO STAMP - Japanese Seal Style */}
              <button
                className="px-4 py-2 text-sm font-bold text-white transition-all hover:shadow-md active:scale-95"
                style={{
                  backgroundColor: '#b91c1c',
                  fontFamily: 'Inter, sans-serif',
                  borderRadius: '3px',
                  boxShadow: '0 2px 8px rgba(185, 28, 28, 0.3)',
                  border: '3px solid #b91c1c',
                  letterSpacing: '0.05em',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#991b1b';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(185, 28, 28, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#b91c1c';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(185, 28, 28, 0.3)';
                }}
              >
                Connect Wallet
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-10 space-y-12">
        {/* Hero Section - Text-Focused, Mobile-Optimized */}
        {isLoading ? (
          <HeroSkeleton />
        ) : heroMarket ? (
          <section className="flex flex-col md:flex-row gap-6 md:gap-8 items-start" style={{ borderBottom: '2px solid #1a1a1a', paddingBottom: '2rem' }}>
            {/* Left: Text Content */}
            <div className="flex-1 space-y-4 md:space-y-5">
              {/* Category Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 text-xs md:text-sm font-medium" style={{ backgroundColor: 'rgba(61, 107, 79, 0.1)', border: '1px solid #3d6b4f', borderRadius: '2px', color: '#3d6b4f' }}>
                <TrendingUp className="h-4 w-4" />
                <span style={{ fontFamily: 'Inter, sans-serif', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: '600' }}>
                  {getCategoryFromTags(heroMarket.tags)}
                </span>
              </div>

              {/* Massive Headline - Mobile Responsive with Truncation */}
              <h1
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
                style={{
                  fontFamily: 'Playfair Display, Georgia, serif',
                  color: '#1a1a1a',
                  letterSpacing: '-0.03em',
                  lineHeight: '1.1',
                  display: '-webkit-box',
                  WebkitLineClamp: 4,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {heroMarket.question}
              </h1>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 md:gap-3">
                {heroMarket.tags.slice(0, 4).map((tag, i) => (
                  <span
                    key={i}
                    className="text-xs md:text-sm font-medium"
                    style={{ color: '#888', fontFamily: 'Inter, sans-serif', borderBottom: '1px dotted #bbb' }}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Action Buttons - Full Width on Mobile */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => handleBetClick(heroMarket, "yes")}
                  className="flex-1 md:flex-none px-4 md:px-6 h-11 md:h-12 font-semibold text-white transition-all hover:shadow-lg active:scale-95"
                  style={{ backgroundColor: '#3d6b4f', fontFamily: 'Inter, sans-serif', borderRadius: '2px', fontSize: '0.95rem', boxShadow: '0 2px 6px rgba(61, 107, 79, 0.2)' }}
                >
                  YES {heroMarket.yesProbability}%
                </button>

                <button
                  onClick={() => handleBetClick(heroMarket, "no")}
                  className="flex-1 md:flex-none px-4 md:px-6 h-11 md:h-12 font-semibold text-white transition-all hover:shadow-lg active:scale-95"
                  style={{ backgroundColor: '#c25e3e', fontFamily: 'Inter, sans-serif', borderRadius: '2px', fontSize: '0.95rem', boxShadow: '0 2px 6px rgba(194, 94, 62, 0.2)' }}
                >
                  NO {heroMarket.noProbability}%
                </button>
              </div>
            </div>

            {/* Right: Medium Image - Responsive */}
            <div className="flex-shrink-0 mx-auto md:mx-0">
              <div
                className="overflow-hidden w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64"
                style={{ borderRadius: '4px', border: '1px solid #d4d4d4' }}
              >
                <img
                  src={heroMarket.image}
                  alt={heroMarket.question}
                  className="w-full h-full object-cover transition-all duration-500"
                  style={{
                    filter: 'grayscale(30%) sepia(20%) contrast(1.05) brightness(0.95)',
                    mixBlendMode: 'multiply',
                  }}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.parentElement!.style.background = '#f5f3ef';
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

        {/* Error State - Enhanced UI */}
        {error && (
          <div className="rounded-lg p-8 md:p-12 text-center" style={{ border: '1px solid #e8e4dc', backgroundColor: '#ffffff', maxWidth: '500px', margin: '0 auto' }}>
            <div className="mb-4" style={{ fontSize: '3rem' }}>⚠️</div>
            <h2 className="text-xl md:text-2xl font-bold mb-3" style={{ fontFamily: 'Playfair Display, Georgia, serif', color: '#1a1a1a' }}>
              Network Error
            </h2>
            <p className="text-sm md:text-base mb-6" style={{ color: '#666', fontFamily: 'Inter, sans-serif', lineHeight: '1.5' }}>
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

        {/* Category Filters - Newspaper Navigation */}
        <section style={{ borderBottom: '1px solid #d4d4d4', paddingBottom: '1rem' }}>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {CATEGORIES.map((cat) => (
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
                  backgroundColor: selectedCategory === cat.id ? '#1a1a1a' : 'transparent',
                  border: selectedCategory === cat.id ? 'none' : '1px solid transparent',
                  borderRadius: '2px',
                  color: selectedCategory === cat.id ? '#ffffff' : '#666',
                  letterSpacing: '0.02em',
                }}
                onMouseEnter={(e) => {
                  if (selectedCategory !== cat.id) {
                    e.currentTarget.style.borderBottom = '1px solid #1a1a1a';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedCategory !== cat.id) {
                    e.currentTarget.style.borderBottom = '1px solid transparent';
                  }
                }}
              >
                <span className="mr-2">{cat.emoji}</span>
                <span className="text-sm" style={{ fontWeight: selectedCategory === cat.id ? '600' : '400' }}>{cat.label}</span>
              </button>
            ))}
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
            {filteredMarkets.map((market) => (
              <MarketCard key={market.id} market={market} onBetClick={handleBetClick} />
            ))}
          </section>
        )}

        {!isLoading && filteredMarkets.length === 0 && (
          <div className="text-center py-16 md:py-20">
            <div className="mb-4" style={{ fontSize: '3rem' }}>📭</div>
            <p className="text-lg md:text-xl font-medium mb-2" style={{ color: '#999', fontFamily: 'Playfair Display, Georgia, serif' }}>
              No Markets Found
            </p>
            <p className="text-sm" style={{ color: '#aaa', fontFamily: 'Inter, sans-serif' }}>
              Try selecting a different category or check back later.
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
      <footer className="border-t mt-20 py-12" style={{ borderColor: '#e8e4dc', backgroundColor: '#fefefa' }}>
        <div className="container mx-auto px-6 text-center">
          <p className="text-sm font-medium mb-2" style={{ fontFamily: 'Playfair Display, Georgia, serif', color: '#333333' }}>
            Polymarket Lite
          </p>
          <p className="text-xs" style={{ fontFamily: 'Inter, sans-serif', color: '#999' }}>
            Prediction Markets, Redefined • Data from Polymarket API
          </p>
        </div>
      </footer>
    </div>
  );
}
