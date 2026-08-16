/**
 * CYBERPEHRA REPOSITORY SECRET SCANNER
 * Scans repository files for hardcoded private keys, tokens, or credential leaks.
 * Output includes only file location and pattern name - NEVER prints actual secret strings.
 */

import fs from 'fs';
import path from 'path';

const SECRET_PATTERNS = [
  { name: 'AWS_ACCESS_KEY', regex: new RegExp('AKIA[0-9A-Z]{16}', 'g') },
  { name: 'GITHUB_TOKEN', regex: new RegExp('ghp_[a-zA-Z0-9]{36}', 'g') },
  { name: 'PRIVATE_KEY', regex: new RegExp('-----BEGIN ' + 'PRIVATE KEY-----', 'g') },
  { name: 'SUPABASE_SERVICE_KEY', regex: new RegExp('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9\\.[a-zA-Z0-9_-]+\\.service_role', 'g') }
];

export function scanRepositorySecrets(cwd = process.cwd()) {
  const matches = [];

  function scanDir(dirPath) {
    if (dirPath.includes('node_modules') || dirPath.includes('.git') || dirPath.includes('scratch')) return;
    const items = fs.readdirSync(dirPath);

    items.forEach(item => {
      const fullPath = path.join(dirPath, item);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        scanDir(fullPath);
      } else if (stat.isFile() && (item.endsWith('.js') || item.endsWith('.html') || item.endsWith('.json') || item.endsWith('.toml'))) {
        const content = fs.readFileSync(fullPath, 'utf8');
        SECRET_PATTERNS.forEach(pat => {
          if (pat.regex.test(content)) {
            matches.push({
              file: path.relative(cwd, fullPath),
              patternName: pat.name,
              severity: 'CRITICAL'
            });
          }
        });
      }
    });
  }

  scanDir(cwd);

  return {
    found: matches.length > 0,
    count: matches.length,
    matches
  };
}
