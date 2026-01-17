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

    // Fetch events sorted by 24hr volume (highest first)
    // Increased limit to 50 to get more diverse categories including sports
    const response = await fetch(
      `${GAMMA_EVENTS_API}?limit=50&active=true&closed=false&order=volume24hr:desc`,
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
      .filter((event) => {
        // Must have markets
        if (!event.markets || event.markets.length === 0) {
          return false;
        }

        // Get the top market (highest volume market for this event)
        const topMarket = event.markets[0];

        // Must have question (non-empty string)
        if (!topMarket.question || topMarket.question.trim().length === 0) {
          console.log(`⚠️ Skipping market - empty question`);
          return false;
        }

        // Must have image (non-empty, valid URL)
        if (!topMarket.image || !isValidImageUrl(topMarket.image)) {
          console.log(`⚠️ Skipping market - invalid image URL`);
          return false;
        }

        // Must have outcome prices (note: outcomePrices is a string, not an array)
        if (!topMarket.outcomePrices) {
          console.log(`⚠️ Skipping market - missing outcomePrices`);
          return false;
        }

        // Parse outcomePrices (handle both string and array formats)
        let outcomePriceArray: string[];
        try {
          if (Array.isArray(topMarket.outcomePrices)) {
            // Already an array
            outcomePriceArray = topMarket.outcomePrices as string[];
          } else {
            // String that needs parsing
            outcomePriceArray = JSON.parse(topMarket.outcomePrices);
          }

          if (!Array.isArray(outcomePriceArray) || outcomePriceArray.length !== 2) {
            console.log(`⚠️ Skipping market - invalid outcomePrices structure`);
            return false;
          }
        } catch (e) {
          console.log(`⚠️ Skipping market - failed to parse outcomePrices`);
          return false;
        }

        // Validate prices are real numbers (not both 0.5 placeholder)
        const prices = outcomePriceArray.map(p => parseFloat(p));
        // Check if at least one price is NOT 0.5 (reject only when both are 0.5)
        const hasRealPrices = prices.some(p => p !== 0.5 && p !== null && p !== undefined && !isNaN(p));
        if (!hasRealPrices) {
          console.log(`⚠️ Skipping market - placeholder prices (${prices.join(', ')})`);
          return false;
        }

        // Must have meaningful volume (skip if 0 or undefined)
        if (!event.volume || event.volume <= 0) {
          console.log(`⚠️ Skipping market - zero or invalid volume`);
          return false;
        }

        return true;
      })
      .map((event, index) => {
        const topMarket = event.markets[0];

        // Parse outcome prices (handle both string and array formats)
        let outcomePriceArray: string[];
        if (Array.isArray(topMarket.outcomePrices)) {
          outcomePriceArray = topMarket.outcomePrices as string[];
        } else {
          outcomePriceArray = JSON.parse(topMarket.outcomePrices);
        }

        const yesPrice = parseFloat(outcomePriceArray[0]);
        const noPrice = parseFloat(outcomePriceArray[1]);

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

    // Take top 40 (increased from 20 to get more category diversity)
    const topMarkets = markets.slice(0, 40);

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
