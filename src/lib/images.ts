import { Category } from "@/types/market";

// Default images for each category based on Unsplash
export const DEFAULT_IMAGES: Record<Exclude<Category, "all">, string> = {
  politics: "https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?w=400&h=300&fit=crop",
  geopolitics: "https://images.unsplash.com/photo-1529101091760-61df63224f1b?w=400&h=300&fit=crop",
  business: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=300&fit=crop",
  crypto: "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=400&h=300&fit=crop",
  technology: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=300&fit=crop",
  sports: "https://images.unsplash.com/photo-1461896836934-07f7a423d7f4?w=400&h=300&fit=crop",
  entertainment: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&h=300&fit=crop",
  science: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=300&fit=crop",
  other: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop",
};

// Icon URLs for fallback
export const CATEGORY_ICONS: Record<Exclude<Category, "all">, string> = {
  politics: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop",
  geopolitics: "https://images.unsplash.com/photo-1532375810709-75b1da00537c?w=400&h=300&fit=crop",
  business: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=300&fit=crop",
  crypto: "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=400&h=300&fit=crop",
  technology: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=300&fit=crop",
  sports: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=400&h=300&fit=crop",
  entertainment: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&h=300&fit=crop",
  science: "https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=400&h=300&fit=crop",
  other: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop",
};

/**
 * Gets a fallback image URL based on the market's category
 */
export function getFallbackImage(category: Category): string {
  if (category === "all") return DEFAULT_IMAGES.other;
  return DEFAULT_IMAGES[category] || DEFAULT_IMAGES.other;
}

/**
 * Gets an icon URL based on the market's category
 */
export function getCategoryIcon(category: Category): string {
  if (category === "all") return CATEGORY_ICONS.other;
  return CATEGORY_ICONS[category] || CATEGORY_ICONS.other;
}

/**
 * Validates if a URL is accessible (not implemented client-side due to CORS)
 * Instead, we use onError handlers in Image components
 */
export function isValidImageUrl(url: string): boolean {
  if (!url) return false;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Generates a data URI placeholder for loading states
 */
export function getPlaceholder(category: Category): string {
  const colors = {
    politics: "#3b82f6", // blue
    geopolitics: "#ea580c", // orange
    business: "#8b5cf6", // purple
    crypto: "#f59e0b", // amber
    technology: "#0891b2", // cyan
    sports: "#10b981", // green
    entertainment: "#db2777", // pink
    science: "#4f46e5", // indigo
    other: "#6b7280", // gray
  };

  const color = category === "all" ? colors.other : (colors[category] || colors.other);

  // Simple SVG placeholder
  const svg = `
    <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="300" fill="${color}"/>
      <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="white" font-size="24" font-family="sans-serif">
        ${category.toUpperCase()}
      </text>
    </svg>
  `;

  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}
