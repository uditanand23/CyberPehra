/**
 * CYBERPEHRA DATABASE CLIENT CONFIGURATION
 * Connects to Supabase / PostgreSQL Free Tier for Public Cyber-Intelligence Data.
 * Enforces Zero User Data Retention (0-Day Retention).
 */

import { Logger } from '../utils/logger.js';

// Supabase / Database Environment Variables
const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || '';

/**
 * Generic query wrapper for public dataset endpoints.
 * Returns local fallback dataset if database connection environment variables are unconfigured.
 */
export async function queryPublicDatabase(tableName, fallbackData = []) {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    Logger.info(`[Database] Supabase credentials unconfigured. Serving verified public fallback for table '${tableName}'.`);
    return { ok: true, source: 'fallback_static', data: fallbackData };
  }

  try {
    const endpoint = `${SUPABASE_URL.replace(/\/$/, '')}/rest/v1/${tableName}?select=*`;
    const response = await fetch(endpoint, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      const data = await response.json();
      return { ok: true, source: 'supabase_live', data };
    }

    Logger.warn(`[Database] Supabase query returned HTTP ${response.status} for table '${tableName}'.`);
    return { ok: true, source: 'fallback_static', data: fallbackData };
  } catch (err) {
    Logger.error(`[Database] Error querying table '${tableName}':`, err);
    return { ok: true, source: 'fallback_static', data: fallbackData };
  }
}
