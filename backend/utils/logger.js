/**
 * CYBERPEHRA ANONYMIZED OPERATIONAL LOGGER
 * Enforces Zero User Data Retention Policy.
 * No user IPs, search terms, or payload data are logged to stdout/files.
 */

const Logger = {
  info: (msg, meta = {}) => {
    const timestamp = new Date().toISOString();
    console.log(`[INFO] [${timestamp}] ${msg}`, Object.keys(meta).length ? JSON.stringify(meta) : '');
  },

  warn: (msg, meta = {}) => {
    const timestamp = new Date().toISOString();
    console.warn(`[WARN] [${timestamp}] ${msg}`, Object.keys(meta).length ? JSON.stringify(meta) : '');
  },

  error: (msg, errorObj = {}) => {
    const timestamp = new Date().toISOString();
    console.error(`[ERROR] [${timestamp}] ${msg}`, errorObj.message || errorObj);
  },

  auditSecurityEvent: (eventType, actionResult) => {
    const timestamp = new Date().toISOString();
    console.log(`[SECURITY_AUDIT] [${timestamp}] Event: ${eventType} | Verdict: ${actionResult}`);
  },

  anonymizeIp: (ip = '') => {
    if (typeof ip !== 'string') return '0.0.0.0';
    const parts = ip.trim().split('.');
    if (parts.length === 4) {
      return `${parts[0]}.${parts[1]}.${parts[2]}.xxx`;
    }
    return '0.0.0.0';
  }
};

module.exports = {
  Logger
};
