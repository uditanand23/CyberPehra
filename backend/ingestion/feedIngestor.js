/**
 * CYBERPEHRA PUBLIC FEED INGESTION SERVICE
 * Ingests public threat feeds securely using SSRF Guard, deduplicates via SHA-256 fingerprints,
 * classifies trust levels, and applies Indian geographic mapping.
 */

const { isSafeUrl } = require('../middleware/ssrfGuard.js');
const { TRUSTED_SOURCES } = require('./sources.js');
const { generateIncidentFingerprint, deduplicateIncidents } = require('./deduplicator.js');
const { classifyIncidentTrust } = require('./verifier.js');
const { mapLocationToState } = require('./geoMapper.js');
const { Logger } = require('../utils/logger.js');

/**
 * Ingests public threat incidents from a specified source key.
 * @param {string} sourceKey 
 * @returns {Promise<{ ok: boolean, incidents: Array, isLiveVerified: boolean }>}
 */
async function ingestSourceFeed(sourceKey = 'CERT_IN') {
  const sourceObj = TRUSTED_SOURCES[sourceKey] || TRUSTED_SOURCES.CERT_IN;

  // SSRF Protection check on feed URL
  const ssrfCheck = isSafeUrl(sourceObj.feedUrl);
  if (!ssrfCheck.valid) {
    Logger.warn(`[Ingestion] Feed URL '${sourceObj.feedUrl}' blocked by SSRF Guard: ${ssrfCheck.error}`);
    return { ok: false, incidents: [], isLiveVerified: false };
  }

  try {
    const response = await fetchWithSafeRedirects(sourceObj.feedUrl, {
      headers: {
        'User-Agent': 'CyberPehra-ThreatIntel-Bot/5.0 (+https://cyberpehra.in)'
      }
    });

    if (!response || !response.ok) {
      Logger.warn(`[Ingestion] Feed fetch failed or returned HTTP status for '${sourceKey}'.`);
      return { ok: false, incidents: [], isLiveVerified: false };
    }

    const text = await response.text();
    // Parse items (simplified RSS/JSON extraction)
    const rawItems = extractItemsFromFeedPayload(text, sourceObj);

    const processedIncidents = rawItems.map(item => {
      const { stateCode, stateName } = mapLocationToState(`${item.title} ${item.summary}`);
      const trustInfo = classifyIncidentTrust(sourceObj.sourceKey, item.sourceUrl, true);
      const fingerprint = generateIncidentFingerprint(item.sourceUrl, item.title, sourceObj.sourceKey);

      return {
        fingerprint,
        title: item.title,
        summary: item.summary,
        threatCategory: item.threatCategory || 'FINANCIAL_FRAUD',
        trustClassification: trustInfo.classification,
        isLiveVerified: trustInfo.isLiveVerified,
        sourceKey: sourceObj.sourceKey,
        sourceName: sourceObj.name,
        sourceUrl: item.sourceUrl || sourceObj.feedUrl,
        stateCode,
        stateName,
        districtName: item.districtName || null,
        financialLossInr: item.financialLossInr || 0,
        publishedAt: item.publishedAt || new Date().toISOString(),
        ingestedAt: new Date().toISOString(),
        lastVerifiedAt: new Date().toISOString()
      };
    });

    const deduplicated = deduplicateIncidents(processedIncidents);

    return {
      ok: true,
      incidents: deduplicated,
      isLiveVerified: true
    };
  } catch (err) {
    Logger.error(`[Ingestion] Exception while ingesting feed '${sourceKey}':`, err);
    return { ok: false, incidents: [], isLiveVerified: false };
  }
}

function extractItemsFromFeedPayload(payloadStr = '', sourceObj) {
  // Parsing fallback logic for RSS XML / JSON feeds
  const items = [];
  const titleMatches = payloadStr.match(/<title>([^<]+)<\/title>/g) || [];
  const linkMatches = payloadStr.match(/<link>([^<]+)<\/link>/g) || [];

  for (let i = 1; i < Math.min(titleMatches.length, 10); i++) {
    const rawTitle = titleMatches[i].replace(/<\/?title>/g, '').trim();
    const rawLink = linkMatches[i] ? linkMatches[i].replace(/<\/?link>/g, '').trim() : sourceObj.feedUrl;

    if (rawTitle && rawTitle !== sourceObj.name) {
      items.push({
        title: rawTitle,
        summary: `${rawTitle} - Threat bulletin issued by ${sourceObj.name}.`,
        sourceUrl: rawLink,
        publishedAt: new Date().toISOString()
      });
    }
  }

  return items;
}

/**
 * Fetches outbound URLs with manual redirect handling and SSRF re-validation on Location headers.
 * Max 3 redirects enforced.
 */
async function fetchWithSafeRedirects(initialUrl, fetchOptions = {}, maxRedirects = 3) {
  let currentUrl = initialUrl;
  let redirectsFollowed = 0;

  while (redirectsFollowed <= maxRedirects) {
    const ssrfCheck = isSafeUrl(currentUrl);
    if (!ssrfCheck.valid) {
      Logger.warn(`[SSRF Redirect Guard] Target URL '${currentUrl}' failed SSRF check: ${ssrfCheck.error}`);
      return { ok: false, status: 400, ssrfBlocked: true };
    }

    const options = { ...fetchOptions, redirect: 'manual' };
    const response = await fetch(currentUrl, options);

    // Check HTTP redirect status codes (301, 302, 303, 307, 308)
    if ([301, 302, 303, 307, 308].includes(response.status)) {
      const location = response.headers.get('location');
      if (!location) {
        Logger.warn(`[SSRF Redirect Guard] Redirect HTTP ${response.status} missing Location header.`);
        return response;
      }

      try {
        const resolvedTarget = new URL(location, currentUrl).toString();
        redirectsFollowed++;
        if (redirectsFollowed > maxRedirects) {
          Logger.warn(`[SSRF Redirect Guard] Exceeded maximum redirect limit (${maxRedirects}). Aborting.`);
          return { ok: false, status: 310, error: 'Too many redirects' };
        }
        currentUrl = resolvedTarget;
      } catch (err) {
        Logger.warn(`[SSRF Redirect Guard] Invalid redirect Location header '${location}'.`);
        return { ok: false, status: 400, error: 'Invalid redirect Location' };
      }
    } else {
      return response;
    }
  }

  return { ok: false, status: 310, error: 'Too many redirects' };
}

module.exports = {
  ingestSourceFeed,
  fetchWithSafeRedirects
};
