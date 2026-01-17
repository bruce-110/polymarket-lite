/**
 * Edge Case Handling Utilities
 * Protects against extreme values and malformed data
 */

/**
 * Clamp a number between min and max values
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Normalize probabilities to ensure they sum to 100
 */
export function normalizeProbabilities(yesProb: number, noProb: number): [number, number] {
  // Clamp to 0-100 range
  const clampedYes = clamp(yesProb, 0, 100);
  const clampedNo = clamp(noProb, 0, 100);

  // If they sum to 100, return as-is
  if (Math.abs(clampedYes + clampedNo - 100) < 1) {
    return [clampedYes, clampedNo];
  }

  // Otherwise, normalize proportionally
  const total = clampedYes + clampedNo;
  if (total === 0) return [50, 50]; // Default to 50/50 if both are 0

  const normalizedYes = Math.round((clampedYes / total) * 100);
  const normalizedNo = 100 - normalizedYes;

  return [normalizedYes, normalizedNo];
}

/**
 * Truncate text to a maximum length with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

/**
 * Check if a probability is "extreme" (> 90% or < 10%)
 */
export function isExtremeProbability(prob: number): boolean {
  return prob > 90 || prob < 10;
}

/**
 * Get a CSS class for extreme probability styling
 */
export function getProbabilityClass(prob: number): string {
  if (prob >= 95) return 'probability-certain';
  if (prob >= 75) return 'probability-likely';
  if (prob >= 50) return 'probability-moderate';
  if (prob >= 25) return 'probability-unlikely';
  return 'probability-rare';
}

/**
 * Validate image URL format
 */
export function isValidImageUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Format large numbers (e.g., 1500000 -> "$1.5M")
 */
export function formatVolume(volume: number): string {
  if (volume >= 1000000) {
    return `$${(volume / 1000000).toFixed(1)}M`;
  } else if (volume >= 1000) {
    return `$${(volume / 1000).toFixed(1)}K`;
  }
  return `$${volume.toFixed(0)}`;
}
