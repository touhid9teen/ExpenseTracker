// Edge-compatible in-memory sliding window rate limiter.
// Each Edge function instance maintains its own counter, so limits are
// per-instance, not global. This is still effective against runaway clients
// and basic brute-force attacks, and does not require any external service.

const WINDOW_MS = 60 * 1000; // 1 minute window

/**
 * @typedef {Object} RateLimitConfig
 * @property {number} maxRequests - Max requests allowed per window
 * @property {string} errorMessage - Message to return when rate limited
 */

/** @type {Map<string, { count: number, resetAt: number }>} */
const store = new Map();

// Periodically clean up expired entries to prevent memory leaks.
// Uses setInterval which is available in Edge runtime (Web API).
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of store) {
      if (entry.resetAt <= now) store.delete(key);
    }
  }, 60_000);
}

/**
 * Check if a request should be rate limited.
 * Returns a Response with 429 status if rate limited, or null if allowed.
 *
 * @param {Request} request - The incoming request
 * @param {string} identifier - Unique identifier for the client (IP, username, etc.)
 * @param {RateLimitConfig} config - Rate limiting configuration
 * @returns {Response|null} 429 Response if rate limited, null if allowed
 */
export function checkRateLimit(request, identifier, config) {
  const now = Date.now();
  const key = `${identifier}:${config.errorMessage}`;
  let entry = store.get(key);

  if (!entry || entry.resetAt <= now) {
    entry = { count: 1, resetAt: now + WINDOW_MS };
    store.set(key, entry);
    return null;
  }

  entry.count += 1;

  if (entry.count > config.maxRequests) {
    const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
    return new Response(
      JSON.stringify({ error: config.errorMessage }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': String(retryAfter),
          'X-RateLimit-Limit': String(config.maxRequests),
          'X-RateLimit-Reset': String(Math.ceil(entry.resetAt / 1000)),
        },
      }
    );
  }

  return null;
}

/**
 * Extract a consistent client identifier from a request.
 * Uses IP (via x-forwarded-for), falling back to a header fingerprint.
 *
 * @param {Request} request
 * @returns {string}
 */
export function getClientId(request) {
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded?.split(',')[0]?.trim();
  if (ip) return `ip:${ip}`;

  // Fallback: use a combination of available headers
  const userAgent = request.headers.get('user-agent') || 'unknown';
  const acceptLang = request.headers.get('accept-language') || 'unknown';
  return `fp:${userAgent.length}:${acceptLang.length}`;
}
