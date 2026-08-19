/**
 * CYBERPEHRA SLIDING WINDOW RATE LIMITER
 * In-memory sliding window rate limiter per client IP address.
 * Ensures zero-cost compliance without external Redis dependencies.
 */

const clientStore = new Map();
const MAX_CLIENT_ENTRIES = 10000;

function cleanupStaleKeys(now, windowMs) {
  if (clientStore.size < MAX_CLIENT_ENTRIES) return;
  for (const [key, timestamps] of clientStore.entries()) {
    while (timestamps.length > 0 && timestamps[0] <= now - windowMs) {
      timestamps.shift();
    }
    if (timestamps.length === 0) {
      clientStore.delete(key);
    }
  }
}

/**
 * Checks if incoming client request exceeds rate limit.
 * @param {string} clientIp 
 * @param {string} endpointName 
 * @param {number} maxRequests 
 * @param {number} windowMs 
 * @returns {{ limited: boolean, retryAfter: number, remaining: number }}
 */
/**
 * Checks if incoming client request exceeds rate limit.
 * @param {string} clientIp 
 * @param {string} endpointName 
 * @param {number} maxRequests 
 * @param {number} windowMs 
 * @returns {{ limited: boolean, retryAfter: number, remaining: number }}
 */
function checkRateLimit(clientIp = 'unknown', endpointName = 'default', maxRequests = 10, windowMs = 60000) {
  const now = Date.now();
  const key = `${endpointName}:${clientIp}`;

  cleanupStaleKeys(now, windowMs);

  if (!clientStore.has(key)) {
    clientStore.set(key, []);
  }

  const timestamps = clientStore.get(key);

  // Remove timestamps older than windowMs
  while (timestamps.length > 0 && timestamps[0] <= now - windowMs) {
    timestamps.shift();
  }

  if (timestamps.length >= maxRequests) {
    const oldest = timestamps[0];
    const retryAfter = Math.ceil((oldest + windowMs - now) / 1000);
    return {
      limited: true,
      retryAfter: Math.max(1, retryAfter),
      remaining: 0
    };
  }

  timestamps.push(now);
  return {
    limited: false,
    retryAfter: 0,
    remaining: maxRequests - timestamps.length
  };
}

/**
 * Distributed Rate Limiter supporting Upstash Redis REST API with zero external dependencies.
 * Automatically falls back to in-memory checkRateLimit when unconfigured or offline.
 */
async function checkDistributedRateLimit(clientIp = 'unknown', endpointName = 'default', maxRequests = 10, windowMs = 60000) {
  const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!redisUrl || !redisToken) {
    // Unconfigured -> Fallback to in-memory sliding window limiter
    const local = checkRateLimit(clientIp, endpointName, maxRequests, windowMs);
    return { ...local, distributed: false };
  }

  const key = `ratelimit:${endpointName}:${clientIp}`;

  try {
    const response = await fetch(`${redisUrl}/pipeline`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${redisToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify([
        ['INCR', key],
        ['EXPIRE', key, Math.ceil(windowMs / 1000)]
      ])
    });

    if (response.ok) {
      const data = await response.json();
      const currentCount = data[0] ? Number(data[0].result) : 1;
      const limited = currentCount > maxRequests;
      return {
        limited,
        retryAfter: limited ? Math.ceil(windowMs / 1000) : 0,
        remaining: Math.max(0, maxRequests - currentCount),
        distributed: true
      };
    }
  } catch (err) {
    console.warn('[RateLimiter] Upstash Redis REST query failed. Serving in-memory rate limit fallback.');
  }

  const fallback = checkRateLimit(clientIp, endpointName, maxRequests, windowMs);
  return { ...fallback, distributed: false };
}

function getClientIp(event) {
  if (!event || !event.headers) return '127.0.0.1';
  const headers = event.headers;

  // 1. Check Netlify Edge trusted headers first
  const trustedIp = headers['client-ip'] || 
                    headers['Client-Ip'] || 
                    headers['x-nf-client-connection-ip'] || 
                    headers['X-Nf-Client-Connection-Ip'] || 
                    headers['x-real-ip'] || 
                    headers['X-Real-Ip'];

  if (trustedIp && typeof trustedIp === 'string') {
    return trustedIp.trim();
  }

  // 2. Fallback to X-Forwarded-For: pick right-most IP added by edge proxy
  const xForwardedFor = headers['x-forwarded-for'] || headers['X-Forwarded-For'];
  if (xForwardedFor && typeof xForwardedFor === 'string') {
    const parts = xForwardedFor.split(',');
    return parts[parts.length - 1].trim();
  }

  return '127.0.0.1';
}

module.exports = {
  checkRateLimit,
  checkDistributedRateLimit,
  getClientIp
};
