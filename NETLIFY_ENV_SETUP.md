# CYBERPEHRA — Netlify Environment Setup Guide

To enable live threat intelligence scanning, secure threat ingestion, and distributed rate limiting in CYBERPEHRA, configure the following environment variables in your Netlify Project Dashboard.

---

## Required & Recommended Environment Variables

| Variable Name | Required For | Description | Public / Private |
| :--- | :--- | :--- | :--- |
| `VT_API_KEY` | VirusTotal Netlify Function (`virustotal.js`) | Private API key from VirusTotal (v3 REST API). | **Private / Backend Only** |
| `GOOGLE_SAFE_BROWSING_KEY` | Google Safe Browsing Function (`safebrowsing.js`) | Private API key from Google Cloud Console (Safe Browsing API v4). | **Private / Backend Only** |
| `INGEST_SECRET_KEY` | Intel Ingestion Endpoint (`ingest-intel.js`) | Random secret string (32+ characters) passed via `x-internal-key` header to authenticate feed ingestion pipelines. | **Private / Backend Only** |
| `UPSTASH_REDIS_REST_URL` | Distributed Rate Limiter (`rateLimiter.js`) | Upstash Redis REST API Endpoint URL for distributed rate limiting across serverless functions (free tier at upstash.com). | **Private / Backend Only** |
| `UPSTASH_REDIS_REST_TOKEN` | Distributed Rate Limiter (`rateLimiter.js`) | Upstash Redis REST API Bearer Token. | **Private / Backend Only** |

---

## Step-by-Step Configuration in Netlify Dashboard

1. **Log in to Netlify**:
   Go to [app.netlify.com](https://app.netlify.com) and select your **CYBERPEHRA** site project.

2. **Navigate to Environment Variables**:
   Go to **Site Configuration** $\rightarrow$ **Environment variables**.

3. **Add `VT_API_KEY`**:
   - Key: `VT_API_KEY`
   - Value: `<Your VirusTotal API Key>`
   - Scope: **All scopes** (Functions / Builds).

4. **Add `GOOGLE_SAFE_BROWSING_KEY`**:
   - Key: `GOOGLE_SAFE_BROWSING_KEY`
   - Value: `<Your Google Safe Browsing API Key>`
   - Scope: **All scopes** (Functions / Builds).

5. **Add `INGEST_SECRET_KEY`**:
   - Key: `INGEST_SECRET_KEY`
   - Value: `<Random 32+ Character Secret Key>`
   - Scope: **All scopes** (Functions / Builds).

6. **Add Upstash Redis REST Credentials (Optional for Distributed Rate Limiting)**:
   - Create a free serverless Redis database at [upstash.com](https://upstash.com).
   - Add `UPSTASH_REDIS_REST_URL` with your REST URL.
   - Add `UPSTASH_REDIS_REST_TOKEN` with your REST bearer token.
   - Scope: **All scopes** (Functions / Builds).
   - *Note*: If unconfigured, system automatically falls back to zero-cost in-memory sliding window rate limiting.

7. **Redeploy Site**:
   Go to **Deploys** $\rightarrow$ **Trigger deploy** $\rightarrow$ **Clear cache and deploy site** to ensure functions reload with the newly injected environment variables.

---

## Local Development Setup

When running Netlify CLI locally:

Create a `.env` file in the root directory (do **NOT** commit `.env` to Git):

```env
VT_API_KEY=your_virustotal_api_key_here
GOOGLE_SAFE_BROWSING_KEY=your_google_safe_browsing_api_key_here
INGEST_SECRET_KEY=your_32char_random_secret_here
UPSTASH_REDIS_REST_URL=https://your-upstash-instance.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_upstash_rest_token_here
```

Then start the local server with Netlify Dev:

```bash
netlify dev
```

---

## Unconfigured Behavior & Privacy Guarantee

- **Zero Key Exposure**: Private keys (`VT_API_KEY`, `GOOGLE_SAFE_BROWSING_KEY`, `INGEST_SECRET_KEY`, Upstash credentials) are never exposed to client-side JavaScript.
- **Unconfigured Transparency**: If an API key is missing or unconfigured, the CYBERPEHRA scanner explicitly labels that source as `🔒 Not Configured` in the UI without generating fake verdicts.
- **Fallback Protection**: If Upstash Redis credentials are not provided, rate limiting automatically falls back to in-memory sliding window mode gracefully.
