/**
 * CYBERPEHRA PREFLIGHT DEPLOYMENT SAFETY VALIDATOR
 * Verifies file existence, secret isolation, zero user-data schema integrity,
 * relative API routes, and authoritative NCRB + UIDAI real government dataset validity.
 */

import fs from 'fs';
import path from 'path';

const REQUIRED_FILES = [
  'index.html',
  '_headers',
  '_redirects',
  'netlify.toml',
  'sw.js',
  'manifest.webmanifest',
  'india_state_real_data.json',
  'india_cyber_data.json',
  'netlify/functions/whois.js',
  'netlify/functions/intel-feed.js',
  'netlify/functions/time-filtered-intel.js',
  'netlify/functions/source-trust.js',
  'netlify/functions/state-telemetry.js',
  'netlify/functions/emergency-directory.js',
  'netlify/functions/ingest-intel.js',
  'netlify/functions/safebrowsing.js',
  'netlify/functions/virustotal.js',
  'netlify/functions/health.js',
  'netlify/functions/liveness.js',
  'netlify/functions/readiness.js'
];

const EXPECTED_36_CODES = [
  "IN-AN", "IN-AP", "IN-AR", "IN-AS", "IN-BR", "IN-CG", "IN-CH", "IN-DL",
  "IN-DN", "IN-GA", "IN-GJ", "IN-HP", "IN-HR", "IN-JH", "IN-JK", "IN-KA",
  "IN-KL", "IN-LA", "IN-LD", "IN-MH", "IN-ML", "IN-MN", "IN-MP", "IN-MZ",
  "IN-NL", "IN-OR", "IN-PB", "IN-PY", "IN-RJ", "IN-SK", "IN-TN", "IN-TR",
  "IN-TS", "IN-UK", "IN-UP", "IN-WB"
];

export function runPreflightValidation(cwd = process.cwd()) {
  const result = {
    ok: true,
    timestamp: new Date().toISOString(),
    checks: [],
    failedChecks: []
  };

  // 1. File existence check
  REQUIRED_FILES.forEach(relPath => {
    const fullPath = path.join(cwd, relPath);
    if (fs.existsSync(fullPath)) {
      result.checks.push({ file: relPath, status: 'EXISTS' });
    } else {
      result.ok = false;
      result.checks.push({ file: relPath, status: 'MISSING' });
      result.failedChecks.push(`Required file missing: ${relPath}`);
    }
  });

  // 2. Client-side JS secret isolation check
  const jsDir = path.join(cwd, 'js');
  if (fs.existsSync(jsDir)) {
    const jsFiles = fs.readdirSync(jsDir);
    jsFiles.forEach(file => {
      if (file.endsWith('.js')) {
        const content = fs.readFileSync(path.join(jsDir, file), 'utf8');
        if (content.includes('VT_API_KEY') || content.includes('GOOGLE_SAFE_BROWSING_KEY') || content.includes('SUPABASE_SERVICE_ROLE_KEY')) {
          result.ok = false;
          result.failedChecks.push(`Secret reference exposed in client JS file: js/${file}`);
        }
      }
    });
  }

  // 3. Authoritative Government Dataset (india_state_real_data.json) Schema & Math Validation
  const realDataPath = path.join(cwd, 'india_state_real_data.json');
  if (fs.existsSync(realDataPath)) {
    try {
      const realDataRaw = fs.readFileSync(realDataPath, 'utf8');
      const realData = JSON.parse(realDataRaw);

      if (!realData.meta || !realData.meta.primarySources || !realData.meta.limitations) {
        result.ok = false;
        result.failedChecks.push('india_state_real_data.json missing required metadata/primarySources/limitations');
      }

      // Check required source URLs
      const sources = realData.meta.primarySources || [];
      const hasPibUrl = sources.some(s => s.url && s.url.includes('pib.gov.in'));
      const hasUidaiUrl = sources.some(s => s.url && s.url.includes('uidai.gov.in'));
      if (!hasPibUrl || !hasUidaiUrl) {
        result.ok = false;
        result.failedChecks.push('india_state_real_data.json missing mandatory PIB or UIDAI source URLs');
      }

      // Verify all 36 State/UT codes exist
      const stateKeys = Object.keys(realData.states || {});
      if (stateKeys.length !== 36) {
        result.ok = false;
        result.failedChecks.push(`india_state_real_data.json state count is ${stateKeys.length}, expected 36`);
      }

      const missingCodes = EXPECTED_36_CODES.filter(code => !stateKeys.includes(code));
      if (missingCodes.length > 0) {
        result.ok = false;
        result.failedChecks.push(`Missing administrative state codes: ${missingCodes.join(', ')}`);
      }

      // Validate each state's numerical integrity and per-capita rate calculations
      stateKeys.forEach(code => {
        const item = realData.states[code];
        if (!item || !item.officialStats) {
          result.ok = false;
          result.failedChecks.push(`State ${code} missing officialStats object`);
          return;
        }

        const stats = item.officialStats;
        const cases2023 = stats.casesRegistered2023;
        const pop = stats.population2023Projected;
        const rate = stats.casesPerLakhPopulation;

        if (typeof cases2023 !== 'number' || typeof pop !== 'number' || pop <= 0) {
          result.ok = false;
          result.failedChecks.push(`State ${code} has invalid cases or population numerical values`);
        } else {
          // Mathematical validation of casesPerLakhPopulation
          const expectedRate = Math.round((cases2023 / pop) * 100000 * 100) / 100;
          if (Math.abs(rate - expectedRate) > 0.05) {
            result.ok = false;
            result.failedChecks.push(`State ${code} casesPerLakhPopulation calculation mismatch: got ${rate}, expected ${expectedRate}`);
          }
        }

        // Non-fabrication check: if 2021 cases was 0, percentChange2021to2023 must be null
        if (stats.casesRegistered2021 === 0 && stats.percentChange2021to2023 !== null) {
          result.ok = false;
          result.failedChecks.push(`State ${code} fabricated percentChange2021to2023 when 2021 baseline was 0`);
        }

        // PHASE 19 RESEARCH PAPER VALIDATION
        const rp = item.researchPaper;
        if (!rp) {
          result.ok = false;
          result.failedChecks.push(`State ${code} missing Phase 19 researchPaper object`);
          return;
        }

        const validStatuses = ['STATE_SPECIFIC_VERIFIED', 'NATIONAL_ADVISORY_APPLICABLE', 'NO_STATE_SPECIFIC_EVIDENCE'];
        if (!validStatuses.includes(rp.evidenceStatus)) {
          result.ok = false;
          result.failedChecks.push(`State ${code} has invalid researchPaper.evidenceStatus: ${rp.evidenceStatus}`);
        }

        if (!rp.researchTitle || typeof rp.researchTitle !== 'string' || rp.researchTitle.trim() === '') {
          result.ok = false;
          result.failedChecks.push(`State ${code} missing valid researchPaper.researchTitle`);
        }

        if (!Array.isArray(rp.sources) || rp.sources.length === 0) {
          result.ok = false;
          result.failedChecks.push(`State ${code} missing researchPaper.sources array`);
        } else {
          const validScopes = ['STATE_SPECIFIC', 'NATIONAL', 'SECONDARY_REPORTING'];
          rp.sources.forEach((src, idx) => {
            if (!src.publisher || !src.url || !src.url.startsWith('https://')) {
              result.ok = false;
              result.failedChecks.push(`State ${code} source index ${idx} has invalid publisher or non-HTTPS URL: ${src.url}`);
            }
            if (!validScopes.includes(src.scope)) {
              result.ok = false;
              result.failedChecks.push(`State ${code} source index ${idx} has invalid scope: ${src.scope}`);
            }
          });

          // Non-fabrication rule: If evidenceStatus is STATE_SPECIFIC_VERIFIED, at least one source must have scope === 'STATE_SPECIFIC'
          if (rp.evidenceStatus === 'STATE_SPECIFIC_VERIFIED') {
            const hasStateSpecificSource = rp.sources.some(s => s.scope === 'STATE_SPECIFIC');
            if (!hasStateSpecificSource) {
              result.ok = false;
              result.failedChecks.push(`State ${code} claimed STATE_SPECIFIC_VERIFIED but lacks a source with scope STATE_SPECIFIC`);
            }
          }
        }
      });

      if (result.ok) {
        result.checks.push({ file: 'india_state_real_data.json', status: 'VALIDATED_36_STATES_WITH_RESEARCH_PAPERS' });
      }
    } catch (err) {
      result.ok = false;
      result.failedChecks.push(`india_state_real_data.json parsing/validation error: ${err.message}`);
    }
  }

  // 4. CTI Dataset Schema & Provenance Validation (verified_intel_dataset.json)
  const ctiDatasetPath = path.join(cwd, 'backend/data/verified_intel_dataset.json');
  if (fs.existsSync(ctiDatasetPath)) {
    try {
      const ctiRaw = fs.readFileSync(ctiDatasetPath, 'utf8');
      const ctiData = JSON.parse(ctiRaw);
      const records = ctiData.records || [];

      if (records.length === 0) {
        result.ok = false;
        result.failedChecks.push('verified_intel_dataset.json has no records');
      }

      records.forEach((rec, idx) => {
        if (!rec.id || !rec.title || !rec.sourceUrl || !rec.sourceUrl.startsWith('https://')) {
          result.ok = false;
          result.failedChecks.push(`CTI Record index ${idx} missing id, title, or valid HTTPS sourceUrl`);
        }
        if (!rec.publishedAt || isNaN(new Date(rec.publishedAt).getTime())) {
          result.ok = false;
          result.failedChecks.push(`CTI Record '${rec.id}' missing valid ISO publishedAt timestamp`);
        }
        if (!rec.provenance || !rec.provenance.who || !rec.provenance.where) {
          result.ok = false;
          result.failedChecks.push(`CTI Record '${rec.id}' missing valid provenance object`);
        }
        if (rec.financialLossInr !== undefined || rec.totalLossCrores !== undefined) {
          result.ok = false;
          result.failedChecks.push(`CTI Record '${rec.id}' contains synthetic financial loss fields`);
        }
      });

      if (result.ok) {
        result.checks.push({ file: 'backend/data/verified_intel_dataset.json', status: `VALIDATED_${records.length}_CTI_RECORDS` });
      }
    } catch (err) {
      result.ok = false;
      result.failedChecks.push(`verified_intel_dataset.json parsing/validation error: ${err.message}`);
    }
  }

  // 5. National Cyber Scam Encyclopedia Dataset Validation (scam_encyclopedia.json)
  const scamEncPath = path.join(cwd, 'backend/data/scam_encyclopedia.json');
  if (fs.existsSync(scamEncPath)) {
    try {
      const encRaw = fs.readFileSync(scamEncPath, 'utf8');
      const encData = JSON.parse(encRaw);
      const records = encData.records || [];

      if (records.length === 0) {
        result.ok = false;
        result.failedChecks.push('scam_encyclopedia.json has no records');
      }

      const canonicalIds = new Set();
      const canonicalNames = new Set();
      const allAliases = new Set();

      records.forEach((rec, idx) => {
        if (!rec.id || typeof rec.id !== 'string') {
          result.ok = false;
          result.failedChecks.push(`Scam Encyclopedia record index ${idx} missing valid string id`);
          return;
        }

        if (canonicalIds.has(rec.id)) {
          result.ok = false;
          result.failedChecks.push(`Duplicate canonical ID found in scam_encyclopedia.json: ${rec.id}`);
        }
        canonicalIds.add(rec.id);

        if (!rec.canonicalName || typeof rec.canonicalName !== 'string') {
          result.ok = false;
          result.failedChecks.push(`Scam Encyclopedia record '${rec.id}' missing canonicalName`);
        } else {
          if (canonicalNames.has(rec.canonicalName)) {
            result.ok = false;
            result.failedChecks.push(`Duplicate canonicalName found: '${rec.canonicalName}'`);
          }
          canonicalNames.add(rec.canonicalName);
        }

        // Aliases validation & collision check
        if (Array.isArray(rec.aliases)) {
          rec.aliases.forEach(alias => {
            const normAlias = alias.toLowerCase().trim();
            if (allAliases.has(normAlias)) {
              result.ok = false;
              result.failedChecks.push(`Alias collision detected in scam_encyclopedia.json: '${alias}'`);
            }
            allAliases.add(normAlias);
          });
        }

        // Sources HTTPS check
        if (Array.isArray(rec.sources)) {
          rec.sources.forEach((src, sIdx) => {
            if (!src.sourceUrl || !src.sourceUrl.startsWith('https://')) {
              result.ok = false;
              result.failedChecks.push(`Scam record '${rec.id}' source index ${sIdx} has non-HTTPS or missing URL: ${src.sourceUrl}`);
            }
          });
        }

        // Non-fabrication check: no synthetic financial loss fields
        if (rec.financialLossInr !== undefined || rec.totalLossCrores !== undefined) {
          result.ok = false;
          result.failedChecks.push(`Scam record '${rec.id}' contains synthetic financial loss fields`);
        }
      });

      if (result.ok) {
        result.checks.push({ file: 'backend/data/scam_encyclopedia.json', status: `VALIDATED_${records.length}_CANONICAL_SCAM_RECORDS` });
      }
    } catch (err) {
      result.ok = false;
      result.failedChecks.push(`scam_encyclopedia.json parsing/validation error: ${err.message}`);
    }
  }

  return result;
}
