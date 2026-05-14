import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function extractMapsUrl(input: string | null | undefined): string {
  if (!input) return '';
  
  const trimmedInput = input.trim();
  
  // If it's an iframe tag, extract the src attribute
  if (trimmedInput.includes('<iframe')) {
    const srcMatch = trimmedInput.match(/src="([^"]+)"/);
    if (srcMatch && srcMatch[1]) {
      return srcMatch[1];
    }
  }
  
  return trimmedInput;
}

/**
 * Helper to get proper URLs for Google Maps.
 * Some URLs are only for iframes (embed), while others are for external links.
 */
export function getMapsLinks(input: string | null | undefined, fallbackQuery?: string) {
  const url = extractMapsUrl(input);
  const fallback = fallbackQuery 
    ? `https://www.google.com/maps/search/${encodeURIComponent(fallbackQuery)}`
    : '';

  if (!url) {
    return {
      embed: fallback ? `${fallback}&output=embed` : '',
      external: fallback
    };
  }

  // Detect if it's an embed-only URL (from <iframe>)
  const isEmbedOnly = url.includes('/maps/embed') || url.includes('pb=');

  if (isEmbedOnly) {
    return {
      embed: url,
      // Embed URLs cannot be used in <a> tags directly for navigation in most cases, 
      // so we use the search fallback for the external button to ensure it works.
      external: fallback || url.replace('/maps/embed', '/maps').split('?')[0]
    };
  }

  // Standard Google Maps link
  return {
    embed: url.includes('output=embed') ? url : `${url}${url.includes('?') ? '&' : '?'}output=embed`,
    external: url
  };
}

export function stripHtml(html: string): string {
  if (!html) return '';
  return html.replace(/<[^>]*>?/gm, '');
}
