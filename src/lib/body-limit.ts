/**
 * Request Body Size Limit Utility
 * 
 * Next.js API routes default to a 4 MB body size limit. This utility
 * provides a way to enforce smaller limits on specific routes where
 * large payloads are not expected (auth, chat, etc.).
 * 
 * For Next.js, the body size limit is configured at the route level
 * via the `export const config` object. This utility provides the
 * common configurations as constants.
 * 
 * Usage in a route file:
 *   export const config = { api: { bodyParser: { sizeLimit: BODY_SIZE.SMALL } } };
 * 
 * Size limits:
 * - SMALL  (16 KB):  Auth endpoints, OTP verification, simple lookups
 * - MEDIUM  (128 KB): Chat messages, profile updates, notes, tasks
 * - LARGE  (1 MB):   Symptom logs with embedded data, meal plans
 * - DEFAULT (4 MB):   Next.js default, used for file uploads etc.
 */

export const BODY_SIZE = {
    /** 16 KB — auth, OTP, simple JSON payloads */
    SMALL: '16kb',
    /** 128 KB — chat, profiles, notes, tasks */
    MEDIUM: '128kb',
    /** 1 MB — symptom logs, wellness logs, meal plans */
    LARGE: '1mb',
    /** 4 MB — Next.js default */
    DEFAULT: '4mb',
} as const;

/**
 * Returns the recommended body size limit for a given route type.
 */
export function getBodySizeLimit(routeType: 'auth' | 'chat' | 'profile' | 'content' | 'default'): string {
    switch (routeType) {
        case 'auth': return BODY_SIZE.SMALL;
        case 'chat': return BODY_SIZE.MEDIUM;
        case 'profile': return BODY_SIZE.MEDIUM;
        case 'content': return BODY_SIZE.LARGE;
        default: return BODY_SIZE.DEFAULT;
    }
}