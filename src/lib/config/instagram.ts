/**
 * Centralized Instagram configuration for Awaraa's Culture.
 * 
 * Provides single source of truth for the official Instagram username,
 * deep-link URLs (Meta official ig.me and web profile/DM), and helper methods.
 */

export const INSTAGRAM_USERNAME =
  process.env.NEXT_PUBLIC_INSTAGRAM_USERNAME || 'awaraas_culture';

export const INSTAGRAM_CONFIG = {
  username: INSTAGRAM_USERNAME,
  handle: `@${INSTAGRAM_USERNAME}`,
  // Official Meta direct messaging shortlink (supported on mobile apps and desktop browsers)
  dmUrl: `https://ig.me/m/${INSTAGRAM_USERNAME}`,
  // Web browser fallback direct messaging URL
  webDmUrl: `https://www.instagram.com/direct/t/${INSTAGRAM_USERNAME}/`,
  // Profile URL
  profileUrl: `https://www.instagram.com/${INSTAGRAM_USERNAME}/`,
} as const;

/**
 * Get the official Instagram DM URL for Awaraa's Culture.
 * Uses official ig.me/m/<username> deep link supported across mobile apps and web.
 */
export function getInstagramDmUrl(username: string = INSTAGRAM_USERNAME): string {
  return `https://ig.me/m/${username}`;
}

/**
 * Get the official Instagram profile URL for Awaraa's Culture.
 */
export function getInstagramProfileUrl(username: string = INSTAGRAM_USERNAME): string {
  return `https://www.instagram.com/${username}/`;
}
