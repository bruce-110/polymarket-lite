# Polymarket Lite 🎯

A sophisticated prediction market interface inspired by editorial journal aesthetics, featuring real-time odds updates and elegant typography.

## ✨ Features

- **Real-time Updates**: Auto-refreshes every 10 seconds for live odds
- **Category Filtering**: Politics, Crypto, Sports, Business, and more
- **Responsive Design**: Mobile-optimized with elegant touch interactions
- **Sophisticated Typography**: Playfair Display headers + Inter body text
- **Hot Trending**: Top markets by volume in the betting drawer
- **Data Validation**: Robust edge case handling and probability normalization

## 🚀 Tech Stack

- **Framework**: Next.js 14.2.5 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom inline styles
- **Data Fetching**: SWR for real-time updates
- **API**: Polymarket Gamma API
- **Deployment**: Vercel (global CDN)

## 📦 Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## 🎨 Design Philosophy

Inspired by *The New York Times* and *The Economist*, this app features:
- Warm, paper-like backgrounds (#fefefa)
- Muted, editorial color palette
- Elegant serif typography (Playfair Display)
- Refined spacing and hierarchy
- Subtle grayscale image treatments

## 📊 API Integration

Uses the Polymarket Gamma API:
- **Endpoint**: `/api/markets`
- **Fetch Limit**: 50 events, returns top 40 markets
- **Refresh Rate**: 10 seconds
- **Features**:
  - Probability normalization (ensures sum = 100%)
  - Tag deduplication
  - Volume-based sorting
  - Year correction (2025 → 2026)

## 🔧 Configuration

### Environment Variables
No environment variables required - uses public Gamma API.

### Vercel Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

## 📁 Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── markets/
│   │       └── route.ts       # API endpoint for market data
│   ├── page.tsx                # Homepage with category filters
│   └── layout.tsx              # Root layout
├── components/
│   ├── MarketCard.tsx          # Individual market card
│   ├── MarketCardSkeleton.tsx  # Loading skeleton
│   ├── BettingDrawer.tsx       # Bet placement drawer
│   └── ui/                     # UI components (drawer, button, etc.)
├── hooks/
│   └── useMarkets.ts           # SWR hook for market data
├── lib/
│   └── edgeCases.ts            # Edge case utilities
└── types/
    └── market.ts               # TypeScript definitions
```

## 🎯 Key Features Implementation

### Real-time Updates
- SWR with 10-second refresh interval
- 5-second deduping interval
- Automatic revalidation on focus/reconnect

### Category Filtering
- Enhanced keyword matching
- Supports: Politics, Crypto, Sports, Business, Other
- Fallback keyword matching for better categorization

### Profit Calculation
- Safe division handling for extreme probabilities
- Display capping for values over 1M
- ROI calculation with proper formatting

### Mobile Responsiveness
- Touch-friendly buttons (min 80px width)
- Responsive image sizes (80px → 96px)
- Text truncation with line-clamp-3
- Full-width buttons on mobile

## 🐛 Known Issues & Fixes

### Session History (2026-01-15)

**Fixed Issues:**
1. ✅ Sports category empty - Increased API limits (40 markets)
2. ✅ Real-time updates not working - Reduced refresh to 10s
3. ✅ Wrong year (2025) - API-level replacement to 2026
4. ✅ Profit shows $Infinity - Safe price calculation
5. ✅ Hot Trending empty - Implemented full trending section

See [NIGHT_WORK_LOG.md](./NIGHT_WORK_LOG.md) for complete details.

## 📝 License

This project uses data from the Polymarket Gamma API.

## 🙏 Credits

- **Design**: Editorial journal aesthetic (NYT, Economist inspired)
- **Data**: Polymarket Gamma API
- **Icons**: Lucide React
- **Fonts**: Playfair Display, Inter

---

**Status**: Production Ready (95%)

*Deployed on Vercel with global CDN 🌍*
