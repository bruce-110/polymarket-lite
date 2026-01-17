import { NextResponse } from "next/server";
import { normalizeProbabilities, isValidImageUrl } from "@/lib/edgeCases";

// Gamma API - Events endpoint (better for trending discovery)
const GAMMA_EVENTS_API = "https://gamma-api.polymarket.com/events";

export const dynamic = "force-dynamic";

interface GammaMarket {
  id: string;
  question: string;
  description: string;
  outcomePrices: string | string[]; // Can be either string "[\"0.65\", \"0.25\"]" or array ["0.65", "0.25"]
  tokens?: {
    outcome: string;
    price: number;
  }[];
  tags: any[]; // Gamma API returns tag objects
  image: string;
  icon: string;
  end_date: string;
  volume: number;
  liquidity: number;
}

interface GammaEvent {
  id: string;
  slug: string;
  name: string;
  markets: GammaMarket[];
  tags: any[]; // Gamma API returns tag objects
  volume: number;
  liquidity: number;
}

export async function GET() {
  try {
    console.log("🔥 Fetching trending events from Gamma API...");

    // Fetch events sorted by total volume (all time) to capture major geopolitical events
    // Total volume is better than 24hr volume for showing important long-term trends
    const response = await fetch(
      `${GAMMA_EVENTS_API}?limit=500&active=true&closed=false&order=volume:desc`,
      {
        headers: {
          "User-Agent": "PolymarketLite/1.0",
        },
        cache: 'no-store', // Disable caching for real-time data
      }
    );

    if (!response.ok) {
      throw new Error(`Gamma API error: ${response.status}`);
    }

    const eventsData = await response.json();
    const rawEvents: GammaEvent[] = eventsData.data || eventsData || [];

    console.log(`📊 Loaded ${rawEvents.length} events from Gamma API`);

    // Log first few events to see what we're getting
    if (rawEvents.length > 0) {
      console.log("🔥 Top 3 events by volume:");
      rawEvents.slice(0, 3).forEach((event, i) => {
        console.log(`  ${i + 1}. ${event.name || 'Unnamed'} (${event.markets?.length || 0} markets, $${(event.volume / 1000000).toFixed(1)}M volume)`);
        if (event.markets && event.markets.length > 0) {
          const topMarket = event.markets[0];
          console.log(`     → Top market: "${topMarket.question}"`);
          // Parse outcomePrices for logging (handle both string and array)
          try {
            const priceString = typeof topMarket.outcomePrices === 'string'
              ? topMarket.outcomePrices
              : JSON.stringify(topMarket.outcomePrices);
            const prices = JSON.parse(priceString || '[]');
            console.log(`     → Prices: ${Array.isArray(prices) ? prices.join(', ') : 'N/A'}`);
          } catch {
            console.log(`     → Prices: N/A (parse error)`);
          }
        }
      });
    }

    // Transform events into our market format
    const markets = rawEvents
      .map((event) => {
        // Must have markets
        if (!event.markets || event.markets.length === 0) {
          return null;
        }

        // Must have meaningful volume (skip if 0 or undefined)
        if (!event.volume || event.volume <= 0) {
          return null;
        }

        // Find the first market with valid prices (not 0/1)
        let validMarket = null;
        for (const market of event.markets) {
          // Must have question
          if (!market.question || market.question.trim().length === 0) {
            continue;
          }

          // Must have image
          if (!market.image || !isValidImageUrl(market.image)) {
            continue;
          }

          // Must have outcome prices
          if (!market.outcomePrices) {
            continue;
          }

          // Parse outcomePrices
          let outcomePriceArray: string[];
          try {
            if (Array.isArray(market.outcomePrices)) {
              outcomePriceArray = market.outcomePrices as string[];
            } else {
              outcomePriceArray = JSON.parse(market.outcomePrices);
            }

            if (!Array.isArray(outcomePriceArray) || outcomePriceArray.length !== 2) {
              continue;
            }
          } catch (e) {
            continue;
          }

          // Parse prices
          const prices = outcomePriceArray.map(p => parseFloat(p));

          // Skip if prices are 0/1 (resolved or no liquidity)
          const yesPrice = prices[0];
          const noPrice = prices[1];

          // Found a valid market!
          // Include all markets regardless of probability to show complete picture
          validMarket = { ...market, yesPrice, noPrice };
          break;
        }

        return validMarket ? { event, market: validMarket } : null;
      })
      .filter((item): item is { event: GammaEvent; market: any & { yesPrice: number; noPrice: number } } => item !== null)
      .map(({ event, market: topMarket }, index) => {
        // Prices already parsed in the filter step
        const yesPrice = topMarket.yesPrice;
        const noPrice = topMarket.noPrice;

        // Calculate raw probabilities
        const rawYesProbability = Math.round(yesPrice * 100);
        const rawNoProbability = Math.round(noPrice * 100);

        // Normalize to ensure they sum to 100
        const [yesProbability, noProbability] = normalizeProbabilities(rawYesProbability, rawNoProbability);

        // Combine event tags and market tags
        // Note: Gamma API returns tag objects, we need to extract labels
        const eventTagLabels = (event.tags || [])
          .map((tag: any) => {
            if (typeof tag === 'string') return tag;
            if (tag?.label) return tag.label;
            return null;
          })
          .filter(Boolean);

        const marketTagLabels = (topMarket.tags || [])
          .map((tag: any) => {
            if (typeof tag === 'string') return tag;
            if (tag?.label) return tag.label;
            return null;
          })
          .filter(Boolean);

        // Combine and deduplicate tags using Array.from for better compatibility
        const allTags = Array.from(new Set([...eventTagLabels, ...marketTagLabels]));

        // If no tags, add "Other" as fallback
        const finalTags = allTags.length > 0 ? allTags : ["Other"];

        // Format volume
        const formattedVolume = event.volume
          ? `$${(event.volume / 1000000).toFixed(1)}M`
          : "$100K";

        // Log first market for debugging
        if (index === 0) {
          console.log("✅ First processed market:");
          console.log(`  Event: ${event.name}`);
          console.log(`  Question: ${topMarket.question}`);
          console.log(`  Prices: ${yesProbability}% / ${noProbability}%`);
          console.log(`  Tags: ${finalTags.slice(0, 3).join(', ')}`);
        }

        // Fix 2025 → 2026 in tags and question
        const fixedTags = finalTags.map(tag =>
          tag.replace(/2025/g, "2026")
            .replace(/2025 Predictions/g, "2026 Predictions")
        );

        const fixedQuestion = topMarket.question.replace(/2025/g, "2026");

        return {
          id: topMarket.id,
          question: fixedQuestion,
          description: topMarket.description || "",
          yesPrice: yesPrice,
          noPrice: noPrice,
          yesProbability: yesProbability,
          noProbability: noProbability,
          image: topMarket.image,
          icon: topMarket.icon,
          tags: fixedTags,
          endDate: topMarket.end_date,
          marketSlug: topMarket.id,
          eventName: event.name,
          eventSlug: event.slug,
          active: true,
          acceptingOrders: true,
          volume: formattedVolume,
          volumeScore: event.volume || 0, // For sorting
        };
      });

    // Sort by volume (highest first)
    markets.sort((a, b) => (b.volumeScore || 0) - (a.volumeScore || 0));

    // Filter out:
    // 1. Markets with extreme probabilities (3% or below, or 97% or above)
    // 2. China-related markets
    const filteredMarkets = markets.filter((market) => {
      // Filter out extreme probabilities (3% or below, or 97% or above)
      const isExtremeProbability =
        market.yesProbability <= 3 ||
        market.yesProbability >= 97 ||
        market.noProbability <= 3 ||
        market.noProbability >= 97;

      // Filter out China-related markets
      const chinaKeywords = [
        "china", "chinese", "xi jinping", "beijing", "prc",
        "shanghai", "taiwan", "hong kong", "hk", "roc",
        "习近平", "中国", "台湾", "香港"
      ];
      const questionLower = market.question.toLowerCase();
      const tagsLower = market.tags.map(t => t.toLowerCase()).join(" ");
      const isChinaRelated = chinaKeywords.some(keyword =>
        questionLower.includes(keyword.toLowerCase()) ||
        tagsLower.includes(keyword.toLowerCase())
      );

      // Keep market if it's not extreme probability and not China-related
      return !isExtremeProbability && !isChinaRelated;
    });

    console.log(`📊 Filtered ${markets.length - filteredMarkets.length} markets (extreme probabilities ≤3% or ≥97%, or China-related)`);

    // Take top 150 markets from filtered results
    const topMarkets = filteredMarkets.slice(0, 150);

    console.log(`🎯 Returning ${topMarkets.length} markets`);
    console.log(`📊 Top market: "${topMarkets[0]?.question}" (${topMarkets[0]?.yesProbability}% / ${topMarkets[0]?.noProbability}%)`);

    return NextResponse.json(topMarkets, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0, s-maxage=0",
        "Pragma": "no-cache",
        "Expires": "0",
      },
    });
  } catch (error) {
    console.error("❌ Error fetching Gamma API data:", error);
    return NextResponse.json(
      { error: "Failed to fetch market data" },
      { status: 500 }
    );
  }
}
