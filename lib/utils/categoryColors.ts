/**
 * Category Color Mapping for AARA Articles
 * 
 * Used to color-code article cards and category badges
 * with matching neon glow effects.
 */

export const categoryColorMap: Record<string, string> = {
  Mind: '#00AEEF',      // Neon Blue
  Focus: '#00AEEF',     // Neon Blue
  Calm: '#7A5FFF',      // Purple
  Sleep: '#8E44AD',     // Deep Purple
  Body: '#2ECC71',      // Green
  Positivity: '#FFB347', // Warm Orange
  Growth: '#2ECC71',    // Green
}

/**
 * Get the color for a given category
 */
export function getCategoryColor(category: string): string {
  return categoryColorMap[category] || '#00AEEF' // Default to neon blue
}

/**
 * Get Tailwind classes for category glow
 */
export function getCategoryGlowClass(category: string): string {
  const colorMap: Record<string, string> = {
    Mind: 'shadow-[0_0_20px_rgba(0,174,239,0.4)]',
    Focus: 'shadow-[0_0_20px_rgba(0,174,239,0.4)]',
    Calm: 'shadow-[0_0_20px_rgba(122,95,255,0.4)]',
    Sleep: 'shadow-[0_0_20px_rgba(142,68,173,0.4)]',
    Body: 'shadow-[0_0_20px_rgba(46,204,113,0.4)]',
    Positivity: 'shadow-[0_0_20px_rgba(255,179,71,0.4)]',
    Growth: 'shadow-[0_0_20px_rgba(46,204,113,0.4)]',
  }
  return colorMap[category] || 'shadow-[0_0_20px_rgba(0,174,239,0.4)]'
}





