/**
 * CYBERPEHRA INPUT VALIDATOR & SANITIZER
 * Validates request payload structures and sanitizes inputs to prevent XSS / Injection.
 */

import { SECURITY_CONFIG } from '../config/security.js';

export function parseAndValidateJsonBody(event) {
  if (!event) return { valid: false, error: 'Empty event context', statusCode: 400 };

  // Body size check
  if (event.body && event.body.length > SECURITY_CONFIG.MAX_BODY_SIZE_BYTES) {
    return { valid: false, error: 'Payload size exceeds maximum allowed limit (1 MB)', statusCode: 413 };
  }

  let payload = {};
  if (event.body) {
    try {
      payload = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
    } catch (err) {
      return { valid: false, error: 'Invalid JSON request body format', statusCode: 400 };
    }
  }

  return { valid: true, payload };
}

export function sanitizeString(input, maxLength = 1000) {
  if (typeof input !== 'string') return '';
  return input
    .trim()
    .slice(0, maxLength)
    .replace(/<[^>]*>?/gm, ''); // Strip complete HTML tags (e.g. <script>...</script>)
}

export function isValidSha256(hash) {
  return typeof hash === 'string' && /^[a-f0-9]{64}$/i.test(hash.trim());
}
