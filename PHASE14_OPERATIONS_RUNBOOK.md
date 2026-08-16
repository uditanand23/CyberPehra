# 📖 Phase 14 Operational Runbook — CyberPehra

> **Document Type:** Production Operations & Incident Response Manual  
> **Platform Target:** CyberPehra Digital Safety Intelligence Platform  
> **System Architecture:** Serverless Netlify Microservices + Static Verified Telemetry + Zero User-Data Retention.

---

## 1. Incidents & Standard Operating Procedures (SOP 1–14)

### SOP 1: CERT-In Outage / RSS Feed Down
- **Detection:** Health endpoint (`/health`) or ingestion logs report `SOURCE_FETCH_FAILURE` for `CERT_IN`.
- **Automatic Mitigation:** Ingestion verifier marks feed `UNAVAILABLE` (`isLiveVerified: false`). Client `intelService.js` automatically serves verified static telemetry (`india_cyber_data.json`) labeled `⚡ Local verified dataset active`.
- **Operator Action:** No manual action required. Monitor feed URL `https://www.cert-in.org.in/` status.

### SOP 2: I4C Cybercrime Portal Outage
- **Detection:** `NCCC_I4C` feed returns HTTP timeout or 503 error.
- **Automatic Mitigation:** `Promise.allSettled` isolates I4C failure; remaining active sources (CERT-In, RBI) continue ingesting live telemetry normally.

### SOP 3: RBI Advisory Feed Outage
- **Detection:** `RBI_SAFETY` feed fetch returns HTTP 403 / 500 error.
- **Automatic Mitigation:** RBI source status becomes `UNAVAILABLE`; platform serves verified historic banking fraud advisories.

### SOP 4: PIB Fact Check Feed Outage
- **Detection:** `PIB_FACTCHECK` RSS payload fails XML parsing.
- **Automatic Mitigation:** `extractItemsFromFeedPayload()` skips corrupt payload; zero corrupt items stored or displayed.

### SOP 5: Upstash Redis Rate Limiter Outage
- **Detection:** Upstash REST endpoint times out or returns HTTP 500.
- **Automatic Mitigation:** `checkDistributedRateLimit()` catches connection exception and seamlessly reverts to in-memory sliding window rate limiter (`clientStore`).

### SOP 6: Supabase PostgreSQL Database Outage
- **Detection:** Database query helper receives connection error.
- **Automatic Mitigation:** `queryPublicDatabase()` catches PostgreSQL error and falls back to static verified telemetry array in `<2ms`.

### SOP 7: Netlify Function Invocation Drop / Crash
- **Detection:** Netlify function returns HTTP 500 Internal Server Error.
- **Automatic Mitigation:** Serverless handlers catch uncaught exceptions, mask stack traces, and return formatted JSON. Client `intelService.js` falls back to static verified dataset.

### SOP 8: Malicious Input Payload / SSRF Probe Attack
- **Detection:** Influx of requests with loopback IPs (`127.0.0.1`, `::1`), hex IPs (`0x7f000001`), or AWS metadata (`169.254.169.254`).
- **Automatic Mitigation:** `ssrfGuard.js` blocks prohibited URL patterns before executing `fetch()`, returning HTTP 400 Bad Request.

### SOP 9: High-Volume Rate Limit Abuse Attack
- **Detection:** Client IP exceeding 10 requests/minute.
- **Automatic Mitigation:** `checkRateLimit()` rejects excessive calls with HTTP 429 Too Many Requests and `Retry-After` header.

### SOP 10: Suspected Secret Exposure Alarm
- **Procedure:** Run `node scratch/test_phase14_production_operations.js`. Validate `scanRepositorySecrets()` output. Rotate compromised key immediately in Netlify Environment Settings dashboard.

### SOP 11: Supply-Chain Script Compromise
- **Detection:** CDN script hash mismatch or unauthorized script modification.
- **Automatic Mitigation:** Browsers automatically block compromised scripts matching `crossorigin="anonymous"` policies.

### SOP 12: Telemetry Dataset Corruption Alert
- **Procedure:** Run checksum verification against `india_cyber_data.json`. Re-download verified official static dataset if hash check fails.

### SOP 13: Volumetric Traffic Spike (10,000+ Concurrent Visitors)
- **Automatic Mitigation:** 5-minute browser memory cache + `inFlightRequests` promise collapsing collapse identical requests into 1 single HTTP fetch, saving edge bandwidth.

### SOP 14: DDoS Attack Mitigation Boundary
- **Application Level Mitigation:** Request collapsing, 5-minute memory caching, rate limiting, and static JSON fallback.
- **Provider Level Mitigation:** Netlify DDoS protection & Cloudflare Edge DNS filtering handle network-layer (L3/L4) volumetric attacks.
