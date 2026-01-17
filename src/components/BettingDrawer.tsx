"use client";

import { useState, useEffect } from "react";
import { Market } from "@/types/market";
import { Drawer } from "./ui/drawer";
import { X, ChevronUp, ChevronDown, TrendingUp } from "lucide-react";
import { useMarkets } from "@/hooks/useMarkets";

const DEBUG = process.env.NODE_ENV === 'development';

interface BettingDrawerProps {
  open: boolean;
  onClose: () => void;
  market: Market | null;
  outcome: "yes" | "no" | null;
}

const PRESET_AMOUNTS = [10, 50, 100, 500];

export function BettingDrawer({
  open,
  onClose,
  market,
  outcome,
}: BettingDrawerProps) {
  const [selectedAmount, setSelectedAmount] = useState<number>(50);
  const { markets } = useMarkets();

  useEffect(() => {
    if (open) {
      setSelectedAmount(50);
    }
  }, [open, market?.id]);

  // Get top 5 trending markets (excluding current market)
  const trendingMarkets = markets
    .filter(m => m.id !== market?.id)
    .slice(0, 5);

  if (!market || !outcome) return null;

  const price = outcome === "yes" ? market.yesPrice : market.noPrice;
  const probability = Math.round(price * 100);

  // Handle edge case: when price is 0 or very close to 0
  const safePrice = Math.max(price, 0.001); // Minimum 0.1% to avoid Infinity
  const totalReturn = selectedAmount / safePrice;
  const potentialProfit = totalReturn - selectedAmount;
  const roi = ((potentialProfit / selectedAmount) * 100);

  // Cap extreme values for display
  const displayReturn = totalReturn > 1000000 ? "1M+" : `$${totalReturn.toFixed(2)}`;
  const displayProfit = potentialProfit > 1000000 ? "1M+" : `$${potentialProfit.toFixed(2)}`;
  const displayROI = roi > 10000 ? "10000%+" : `${roi.toFixed(1)}%`;

  const handlePlaceBet = () => {
    if (DEBUG) {
      console.log("=== PLACING BET ===");
      console.log("Market:", market.question);
      console.log("Outcome:", outcome.toUpperCase());
      console.log("Amount:", `$${selectedAmount}`);
      console.log("Price:", price);
      console.log("Probability:", `${probability}%`);
      console.log("Potential Profit:", `$${potentialProfit.toFixed(2)}`);
      console.log("Total Return:", `$${totalReturn.toFixed(2)}`);
      console.log("ROI:", `${roi.toFixed(2)}%`);
      console.log("==================");
    }
    alert(`Bet placed!\n\nYou're betting $${selectedAmount} on ${outcome.toUpperCase()}\n\nIf you win, you'll get $${totalReturn.toFixed(2)} (+$${potentialProfit.toFixed(2)} profit, ${roi.toFixed(1)}% ROI)`);
    onClose();
  };

  const handleAmountChange = (delta: number) => {
    setSelectedAmount((prev) => Math.max(1, prev + delta));
  };

  const outcomeLabel = outcome === "yes" ? "Yes" : "No";
  const isYes = outcome === "yes";
  const primaryColor = isYes ? "#3d6b4f" : "#c25e3e"; // Forest green or Terracotta
  const hoverColor = isYes ? "#345842" : "#a84d32";

  return (
    <Drawer open={open} onClose={onClose}>
      <div style={{ backgroundColor: '#fefefa' }}>
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-5" style={{ borderColor: '#e8e4dc' }}>
          <h2 className="text-xl font-bold" style={{ fontFamily: 'Playfair Display, Georgia, serif', color: '#333333' }}>
            Place Your Bet
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-2.5 transition-colors"
            style={{ border: '1px solid #e8e4dc' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f5f3ef'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <X className="h-5 w-5" style={{ color: '#666' }} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Hot Trending Section */}
          {trendingMarkets.length > 0 && (
            <div className="pb-5 border-b" style={{ borderColor: '#e8e4dc' }}>
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="h-4 w-4" style={{ color: '#c25e3e' }} />
                <h3 className="text-sm font-bold" style={{ fontFamily: 'Inter, sans-serif', color: '#333333' }}>
                  Hot Trending
                </h3>
              </div>
              <div className="space-y-2">
                {trendingMarkets.map((trendingMarket, index) => (
                  <button
                    key={trendingMarket.id}
                    onClick={() => {
                      // Switch to this market
                      window.location.reload(); // Simple reload to switch markets
                    }}
                    className="w-full text-left p-3 rounded-lg transition-all hover:shadow-md"
                    style={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #e8e4dc',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#f5f3ef';
                      e.currentTarget.style.borderColor = '#d4d4d4';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#ffffff';
                      e.currentTarget.style.borderColor = '#e8e4dc';
                    }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p
                          className="text-sm font-medium leading-snug line-clamp-2"
                          style={{
                            fontFamily: 'Playfair Display, Georgia, serif',
                            color: '#1a1a1a',
                            marginBottom: '4px'
                          }}
                        >
                          {trendingMarket.question}
                        </p>
                        <div className="flex items-center gap-2">
                          <span
                            className="text-xs font-semibold px-2 py-0.5 rounded"
                            style={{
                              backgroundColor: '#f5f3ef',
                              color: '#666',
                              fontFamily: 'Inter, sans-serif'
                            }}
                          >
                            {trendingMarket.tags[0] || 'Market'}
                          </span>
                          <span className="text-xs" style={{ color: '#999', fontFamily: 'Inter, sans-serif' }}>
                            {trendingMarket.volume}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold" style={{ fontFamily: 'Inter, sans-serif', color: '#333333' }}>
                          {trendingMarket.yesProbability}%
                        </div>
                        <div className="text-xs" style={{ color: '#999', fontFamily: 'Inter, sans-serif' }}>
                          YES
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Market Summary */}
          <div className="space-y-4 pb-5 border-b" style={{ borderColor: '#e8e4dc' }}>
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className="px-3 py-1.5 rounded-full text-xs font-bold"
                style={{ backgroundColor: '#f5f3ef', color: '#666', fontFamily: 'Inter, sans-serif' }}
              >
                Market
              </span>
              <span className="text-sm" style={{ color: '#999', fontFamily: 'Inter, sans-serif' }}>
                •
              </span>
              <span className="text-sm" style={{ color: '#666', fontFamily: 'Inter, sans-serif' }}>
                {market.tags.slice(0, 2).join(", ")}
              </span>
            </div>
            <p
              className="text-base font-semibold leading-relaxed"
              style={{ fontFamily: 'Playfair Display, Georgia, serif', color: '#1a1a1a' }}
            >
              {market.question}
            </p>
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold" style={{ fontFamily: 'Inter, sans-serif', color: '#333333' }}>
                Your Position:
              </span>
              <span
                className="text-2xl font-black"
                style={{ fontFamily: 'Inter, sans-serif', color: primaryColor }}
              >
                {outcomeLabel.toUpperCase()}
              </span>
              <span className="text-3xl font-black" style={{ color: '#e8e4dc' }}>
                •
              </span>
              <span className="text-xl font-semibold" style={{ fontFamily: 'Inter, sans-serif', color: '#666' }}>
                {probability}%
              </span>
            </div>
          </div>

          {/* Amount Selection */}
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold" style={{ fontFamily: 'Inter, sans-serif', color: '#333333' }}>
                How much to bet?
              </label>
              <button
                onClick={() => setSelectedAmount((prev) => Math.min(10000, prev * 2))}
                className="text-xs font-semibold transition-colors"
                style={{ fontFamily: 'Inter, sans-serif', color: '#3d6b4f' }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#345842'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#3d6b4f'}
              >
                Double
              </button>
            </div>

            {/* Preset Amounts */}
            <div className="grid grid-cols-4 gap-3">
              {PRESET_AMOUNTS.map((amount) => (
                <button
                  key={amount}
                  onClick={() => setSelectedAmount(amount)}
                  className={`h-14 rounded-lg font-semibold transition-all`}
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    backgroundColor: selectedAmount === amount ? primaryColor : '#ffffff',
                    color: selectedAmount === amount ? '#ffffff' : '#666',
                    border: selectedAmount === amount ? 'none' : '1px solid #e8e4dc',
                    boxShadow: selectedAmount === amount ? '0 4px 12px rgba(0,0,0,0.1)' : 'none',
                  }}
                  onMouseEnter={(e) => {
                    if (selectedAmount !== amount) {
                      e.currentTarget.style.backgroundColor = '#f5f3ef';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedAmount !== amount) {
                      e.currentTarget.style.backgroundColor = '#ffffff';
                    }
                  }}
                >
                  ${amount}
                </button>
              ))}
            </div>

            {/* Custom Amount Control */}
            <div
              className="flex items-center gap-3 rounded-xl p-5"
              style={{ backgroundColor: '#ffffff', border: '1px solid #e8e4dc' }}
            >
              <button
                onClick={() => handleAmountChange(-10)}
                className="h-10 w-10 rounded-lg transition-colors flex items-center justify-center"
                style={{ backgroundColor: '#f5f3ef', border: '1px solid #e8e4dc' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e8e4dc'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f5f3ef'}
              >
                <ChevronDown className="h-5 w-5" style={{ color: '#333333' }} />
              </button>

              <div className="flex-1 text-center">
                <div className="text-4xl font-black" style={{ fontFamily: 'Inter, sans-serif', color: '#333333' }}>
                  ${selectedAmount}
                </div>
              </div>

              <button
                onClick={() => handleAmountChange(10)}
                className="h-10 w-10 rounded-lg transition-colors flex items-center justify-center"
                style={{ backgroundColor: '#f5f3ef', border: '1px solid #e8e4dc' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e8e4dc'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f5f3ef'}
              >
                <ChevronUp className="h-5 w-5" style={{ color: '#333333' }} />
              </button>
            </div>
          </div>

          {/* Potential Returns */}
          <div
            className="rounded-xl p-6 space-y-5"
            style={{ backgroundColor: '#ffffff', border: '1px solid #e8e4dc' }}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold" style={{ fontFamily: 'Inter, sans-serif', color: '#666' }}>
                  Your Stake
                </span>
                <span className="text-2xl font-bold" style={{ fontFamily: 'Inter, sans-serif', color: '#333333' }}>
                  ${selectedAmount}
                </span>
              </div>
            </div>

            <div className="h-px" style={{ backgroundColor: '#e8e4dc' }} />

            <div className="space-y-4">
              <p className="text-sm font-semibold flex items-center gap-2" style={{ fontFamily: 'Inter, sans-serif', color: '#333333' }}>
                <span style={{ fontSize: '1.2rem' }}>💰</span>
                If prediction correct:
              </p>

              <div className="flex items-end justify-between gap-4">
                <div className="flex-1">
                  <div className="text-xs mb-1" style={{ color: '#999', fontFamily: 'Inter, sans-serif' }}>
                    Total Return
                  </div>
                  <div className="text-4xl font-black" style={{ fontFamily: 'Inter, sans-serif', color: '#3d6b4f' }}>
                    {displayReturn}
                  </div>
                </div>

                <div className="flex-1 text-right">
                  <div className="text-xs mb-1" style={{ color: '#999', fontFamily: 'Inter, sans-serif' }}>
                    Profit
                  </div>
                  <div className="text-2xl font-bold" style={{ fontFamily: 'Inter, sans-serif', color: '#3d6b4f' }}>
                    +{displayProfit}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-sm" style={{ color: '#999', fontFamily: 'Inter, sans-serif' }}>
                  Return Rate
                </span>
                <div
                  className="px-5 py-2 rounded-lg"
                  style={{ backgroundColor: 'rgba(61, 107, 79, 0.1)', fontFamily: 'Inter, sans-serif' }}
                >
                  <span className="text-sm font-bold" style={{ color: '#3d6b4f' }}>
                    🚀 +{displayROI}
                  </span>
                </div>
              </div>
            </div>

            {/* Visual probability indicator */}
            <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: '#f5f3ef' }}>
              <div
                className="h-full transition-all duration-300"
                style={{
                  width: `${probability}%`,
                  backgroundColor: primaryColor
                }}
              />
            </div>
            <p className="text-xs text-center" style={{ color: '#999', fontFamily: 'Inter, sans-serif' }}>
              Market probability: {probability}%
            </p>
          </div>

          {/* Place Bet Button */}
          <button
            onClick={handlePlaceBet}
            className="w-full h-16 text-lg font-semibold rounded-xl transition-all hover:shadow-lg active:scale-[0.98] text-white"
            style={{
              fontFamily: 'Inter, sans-serif',
              backgroundColor: primaryColor,
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = hoverColor;
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = primaryColor;
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
            }}
          >
            Confirm Bet ${selectedAmount} on {outcomeLabel.toUpperCase()}
          </button>
        </div>
      </div>
    </Drawer>
  );
}
