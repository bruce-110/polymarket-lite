"use client";

import { useState } from "react";
import { Market } from "@/types/market";
import { getCategoryFromTags } from "@/types/market";
import { getFallbackImage } from "@/lib/images";

interface MarketCardProps {
  market: Market;
  onBetClick: (market: Market, outcome: "yes" | "no") => void;
}

export function MarketCard({ market, onBetClick }: MarketCardProps) {
  const category = getCategoryFromTags(market.tags);
  const [imageError, setImageError] = useState(false);

  // Pastel color scheme for categories
  const categoryInfo = {
    all: { emoji: "🔥", label: "Trending", color: "#3d6b4f", bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-800" },
    politics: { emoji: "🏛️", label: "Politics", color: "#dc2626", bg: "bg-red-50", border: "border-red-200", text: "text-red-800" },
    crypto: { emoji: "₿", label: "Crypto", color: "#2563eb", bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-800" },
    sports: { emoji: "⚽", label: "Sports", color: "#059669", bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-800" },
    business: { emoji: "💰", label: "Business", color: "#7c3aed", bg: "bg-purple-50", border: "border-purple-200", text: "text-purple-800" },
    other: { emoji: "📊", label: "Other", color: "#6b7280", bg: "bg-gray-50", border: "border-gray-200", text: "text-gray-800" },
  }[category];

  // Determine which outcome is more likely
  const yesIsHigher = market.yesProbability > market.noProbability;

  const handleImageError = () => {
    if (!imageError) {
      setImageError(true);
    }
  };

  const imageUrl = imageError ? getFallbackImage(category) : market.image;

  return (
    <div
      className="group flex gap-3 md:gap-4 py-3 md:py-4 transition-all duration-200"
      style={{
        borderBottom: '1px solid #e0ded8',
        alignItems: 'flex-start',
      }}
    >
      {/* Small Thumbnail - Responsive: 80px mobile, 96px desktop */}
      <div className="flex-shrink-0">
        <div
          className="overflow-hidden w-20 h-20 md:w-24 md:h-24"
          style={{ borderRadius: '4px', border: '1px solid #d4d4d4' }}
        >
          <img
            src={imageUrl}
            alt={market.question}
            className="w-full h-full object-cover transition-all duration-500"
            style={{
              filter: 'grayscale(30%) sepia(20%) contrast(1.05) brightness(0.95)',
              mixBlendMode: 'multiply',
            }}
            onError={handleImageError}
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

      {/* Content Area - Takes remaining space */}
      <div className="flex-1 min-w-0 space-y-2 md:space-y-3">
        {/* Title - Newspaper Headline with truncation for long text */}
        <h3
          className="text-base md:text-xl font-bold leading-tight"
          style={{
            fontFamily: 'Playfair Display, Georgia, serif',
            color: '#1a1a1a',
            letterSpacing: '-0.02em',
            lineHeight: '1.3',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {market.question}
        </h3>

        {/* Tags - Pastel Color-Coded */}
        {market.tags && market.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <span
              className={`text-xs font-semibold uppercase tracking-wider px-2.5 py-1 rounded-md border ${categoryInfo.bg} ${categoryInfo.border} ${categoryInfo.text}`}
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              {categoryInfo.emoji} {categoryInfo.label}
            </span>
            {market.tags.slice(0, 2).map((tag, i) => (
              <span
                key={i}
                className="text-xs font-medium px-2.5 py-1 rounded-md border border-gray-200 bg-gray-50 text-gray-600"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Action Buttons - Highlight Higher Probability */}
        <div className="flex gap-2">
          <button
            onClick={() => onBetClick(market, "yes")}
            className="px-3 md:px-4 h-9 md:h-10 font-semibold text-white transition-all hover:shadow-md active:scale-95"
            style={{
              backgroundColor: '#3d6b4f',
              fontFamily: 'Inter, sans-serif',
              borderRadius: '2px',
              fontSize: yesIsHigher ? '0.9rem' : '0.8rem',
              fontWeight: yesIsHigher ? '700' : '600',
              boxShadow: '0 1px 3px rgba(61, 107, 79, 0.2)',
              minWidth: '80px',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#345842';
              e.currentTarget.style.boxShadow = '0 4px 8px rgba(61, 107, 79, 0.3)';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#3d6b4f';
              e.currentTarget.style.boxShadow = '0 1px 3px rgba(61, 107, 79, 0.2)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            YES {market.yesProbability}%
          </button>

          <button
            onClick={() => onBetClick(market, "no")}
            className="px-3 md:px-4 h-9 md:h-10 font-semibold text-white transition-all hover:shadow-md active:scale-95"
            style={{
              backgroundColor: '#c25e3e',
              fontFamily: 'Inter, sans-serif',
              borderRadius: '2px',
              fontSize: !yesIsHigher ? '0.9rem' : '0.8rem',
              fontWeight: !yesIsHigher ? '700' : '600',
              boxShadow: '0 1px 3px rgba(194, 94, 62, 0.2)',
              minWidth: '80px',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#a84d32';
              e.currentTarget.style.boxShadow = '0 4px 8px rgba(194, 94, 62, 0.3)';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#c25e3e';
              e.currentTarget.style.boxShadow = '0 1px 3px rgba(194, 94, 62, 0.2)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            NO {market.noProbability}%
          </button>
        </div>
      </div>
    </div>
  );
}
