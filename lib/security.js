/**
 * 🔒 Vibe AI Security & Sanitization Utilities
 */

// 1. Truncate long user input (Prevent Max Tokens Flooding)
export function sanitizeUserInput(input, maxLength = 500) {
  if (!input) return '';
  let str = typeof input === 'string' ? input : JSON.stringify(input);
  str = str.slice(0, maxLength);
  str = str.replace(/\b(?:\d[ -]*?){13,16}\b/g, '[КАРТА СКРЫТА]');
  return str;
}

// 2. Safe JSON parser with Markdown codeblock stripping
export function parseAiJson(rawContent) {
  if (!rawContent) return { rawText: '' };
  const cleaned = rawContent.replace(/```json\n?|\n?```/g, '').trim();
  try {
    return JSON.parse(cleaned);
  } catch (e) {
    console.warn('⚠️ AI JSON parse warning, returning raw text fallback:', e.message);
    return { rawText: rawContent };
  }
}
