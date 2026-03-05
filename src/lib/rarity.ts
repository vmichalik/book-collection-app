// Genre → rarity color mapping (video game style)
const RARITY_MAP: Record<string, { color: string; label: string }> = {
  'classic': { color: '#fbbf24', label: 'Legendary' },     // gold
  'dystopian': { color: '#a855f7', label: 'Epic' },         // purple
  'sci-fi': { color: '#a855f7', label: 'Epic' },
  'science fiction': { color: '#a855f7', label: 'Epic' },
  'mystery': { color: '#3b82f6', label: 'Rare' },           // blue
  'thriller': { color: '#3b82f6', label: 'Rare' },
  'romance': { color: '#ec4899', label: 'Rare' },           // pink
  'fantasy': { color: '#8b5cf6', label: 'Epic' },           // violet
  'horror': { color: '#ef4444', label: 'Epic' },            // red
  'biography': { color: '#06b6d4', label: 'Rare' },         // cyan
  'non-fiction': { color: '#14b8a6', label: 'Uncommon' },    // teal
  'adventure': { color: '#22c55e', label: 'Uncommon' },     // green
  'coming of age': { color: '#22c55e', label: 'Uncommon' },
  'fiction': { color: '#6b7280', label: 'Common' },          // gray
};

const DEFAULT_RARITY = { color: '#6b7280', label: 'Common' };

export function getRarity(genre?: string) {
  if (!genre) return DEFAULT_RARITY;
  return RARITY_MAP[genre.toLowerCase()] || DEFAULT_RARITY;
}
