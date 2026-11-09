/**
 * Strips HTML tags, script blocks and javascript: protocol to guard against XSS.
 * Returns a trimmed string, or an empty string for non-string input.
 */
export function sanitizeInput(input) {
  if (typeof input !== 'string') return '';
  return input
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]*>/g, '')
    .replace(/javascript:/gi, '')
    .trim();
}