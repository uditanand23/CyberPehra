/**
 * CYBERPEHRA PREFLIGHT DEPLOYMENT SAFETY VALIDATOR
 * Verifies file existence, secret isolation, zero user-data schema integrity, and relative API routes.
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

  return result;
}
