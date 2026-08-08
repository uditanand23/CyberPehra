# CYBERPEHRA — Netlify Environment Setup Guide

To enable live threat intelligence scanning in CYBERPEHRA, configure the following environment variables in your Netlify Project Dashboard.

---

## Required Environment Variables

| Variable Name | Required For | Description | Public / Private |
| :--- | :--- | :--- | :--- |
| `VT_API_KEY` | VirusTotal Netlify Function (`virustotal.js`) | Private API key from VirusTotal (v3 REST API). | **Private / Backend Only** |
| `GOOGLE_SAFE_BROWSING_KEY` | Google Safe Browsing Function (`safebrowsing.js`) | Private API key from Google Cloud Console (Safe Browsing API v4). | **Private / Backend Only** |

---

## Step-by-Step Configuration in Netlify Dashboard

1. **Log in to Netlify**:
   Go to [app.netlify.com](https://app.netlify.com) and select your **CYBERPEHRA** site project.

2. **Navigate to Environment Variables**:
   Go to **Site Configuration** $\rightarrow$ **Environment variables**.

3. **Add `VT_API_KEY`**:
   - Click **Add a variable** $\rightarrow$ **Add a single variable**.
   - Key: `VT_API_KEY`
   - Value: `<Your VirusTotal API Key>`
   - Scope: **All scopes** (Functions / Builds).

4. **Add `GOOGLE_SAFE_BROWSING_KEY`**:
   - Click **Add a variable** $\rightarrow$ **Add a single variable**.
   - Key: `GOOGLE_SAFE_BROWSING_KEY`
   - Value: `<Your Google Safe Browsing API Key>`
   - Scope: **All scopes** (Functions / Builds).

5. **Redeploy Site**:
   Go to **Deploys** $\rightarrow$ **Trigger deploy** $\rightarrow$ **Clear cache and deploy site** to ensure functions reload with the newly injected environment variables.

---

## Local Development Setup

When running Netlify CLI locally:

Create a `.env` file in the root directory (do **NOT** commit `.env` to Git):

```env
VT_API_KEY=your_virustotal_api_key_here
GOOGLE_SAFE_BROWSING_KEY=your_google_safe_browsing_api_key_here
```

Then start the local server with Netlify Dev:

```bash
netlify dev
```

---

## Unconfigured Behavior & Privacy Guarantee

- **Zero Key Exposure**: Neither `VT_API_KEY` nor `GOOGLE_SAFE_BROWSING_KEY` are ever exposed to the client-side JavaScript code.
- **Unconfigured Transparency**: If an API key is missing or unconfigured, the CYBERPEHRA scanner explicitly labels that source as `🔒 Not Configured` in the UI without generating fake or guess verdicts.
- **Fallback Protection**: If both live threat intelligence APIs are unavailable, CYBERPEHRA automatically executes a client-side RDAP domain age check and 5-rule URL pattern heuristic analysis labeled `⚠️ Live threat-intel APIs unavailable — showing local heuristic analysis only`.
