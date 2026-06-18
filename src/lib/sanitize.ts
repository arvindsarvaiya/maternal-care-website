/**
 * XSS Sanitization Utilities
 * 
 * Provides functions to strip or escape potentially dangerous HTML/script
 * content from user-generated input before storing or rendering.
 * 
 * Uses a simple but effective approach:
 * 1. Strip all HTML tags for plain-text fields
 * 2. Escape HTML entities for fields that may contain special characters
 */

// Regex to match any HTML tag
const HTML_TAG_REGEX = /<[^>]*>/g;

// Regex to match dangerous event handler attributes (belt-and-suspenders)
const EVENT_HANDLER_REGEX = /\bon\w+\s*=\s*["'][^"']*["']/gi;
const JAVASCRIPT_URL_REGEX = /javascript\s*:/gi;

/**
 * Strips all HTML tags from a string.
 * Use for plain-text fields where no HTML is expected.
 * 
 * @param input - The string to sanitize
 * @returns The sanitized string with all HTML tags removed
 */
export function stripHtml(input: string): string {
    if (!input) return '';
    return input
        .replace(HTML_TAG_REGEX, '')
        .replace(EVENT_HANDLER_REGEX, '')
        .replace(JAVASCRIPT_URL_REGEX, '')
        .trim();
}

/**
 * Escapes HTML special characters to prevent XSS when rendering
 * user content in HTML context.
 * 
 * @param input - The string to escape
 * @returns HTML-entity-escaped string
 */
export function escapeHtml(input: string): string {
    if (!input) return '';
    const map: Record<string, string> = {
        '&': '&',
        '<': '<',
        '>': '>',
        '"': '"',
        "'": '&#x27;',
        '/': '&#x2F;',
        '`': '&#x60;',
        '=': '&#x3D;',
    };
    return input.replace(/[&<>"'/`=]/g, (char) => map[char] || char);
}

/**
 * Sanitizes an object's string values recursively.
 * Strips HTML from all string properties.
 * 
 * @param obj - The object to sanitize
 * @returns A new object with sanitized string values
 */
export function sanitizeObject(obj: Record<string, unknown>): Record<string, unknown> {
    const result: Record<string, unknown> = { ...obj };
    for (const key of Object.keys(result)) {
        const val = result[key];
        if (typeof val === 'string') {
            result[key] = stripHtml(val);
        } else if (val && typeof val === 'object' && !Array.isArray(val)) {
            result[key] = sanitizeObject(val as Record<string, unknown>);
        }
    }
    return result;
}

/**
 * Truncates a string to a maximum length, useful for preventing
 * excessively long input in database fields.
 * 
 * @param input - The string to truncate
 * @param maxLength - Maximum allowed length (default: 5000)
 * @returns Truncated string
 */
export function truncate(input: string, maxLength: number = 5000): string {
    if (!input) return '';
    return input.length > maxLength ? input.slice(0, maxLength) : input;
}