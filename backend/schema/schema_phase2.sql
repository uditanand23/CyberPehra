-- ====================================================================
-- CYBERPEHRA PHASE 2 DATABASE SCHEMA EXTENSIONS
-- Trusted Public Threat Incident Ingestion & Source Attribution Tables
-- ====================================================================

-- 1. Trusted Intelligence Sources Registry Table
CREATE TABLE IF NOT EXISTS trusted_intel_sources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_key VARCHAR(50) UNIQUE NOT NULL, -- e.g. CERT_IN, NCCC_I4C, RBI_SAFETY, PIB_FACTCHECK
    name VARCHAR(100) NOT NULL,
    organization_type VARCHAR(50) NOT NULL, -- GOVERNMENT_CERT, REGULATOR, STATE_POLICE, MEDIA
    feed_url TEXT NOT NULL,
    trust_score INT DEFAULT 100, -- 100 for Government/Regulator, 80 for accredited news
    last_fetched_at TIMESTAMP WITH TIME ZONE,
    last_status VARCHAR(20) DEFAULT 'ACTIVE' -- ACTIVE, UNREACHABLE, DEPRECATED
);

-- 2. Public Threat Incidents & Advisories Repository Table
CREATE TABLE IF NOT EXISTS public_threat_incidents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    fingerprint VARCHAR(64) UNIQUE NOT NULL, -- SHA-256 hash of (canonical_url + title + source_key)
    title VARCHAR(255) NOT NULL,
    summary TEXT NOT NULL,
    threat_category VARCHAR(50) NOT NULL, -- FINANCIAL_FRAUD, APK_MALWARE, SEXTORTION, PHISHING
    trust_classification VARCHAR(50) NOT NULL, -- VERIFIED_OFFICIAL, HIGH_CONFIDENCE_NEWS, UNVERIFIED
    is_live_verified BOOLEAN DEFAULT FALSE,
    source_key VARCHAR(50) REFERENCES trusted_intel_sources(source_key),
    source_name VARCHAR(100) NOT NULL,
    source_url TEXT NOT NULL,
    state_code VARCHAR(10) NOT NULL, -- e.g. IN-DL, IN-MH, IN-BR
    state_name VARCHAR(100) NOT NULL,
    district_name VARCHAR(100),
    financial_loss_inr NUMERIC(14,2) DEFAULT 0.00,
    published_at TIMESTAMP WITH TIME ZONE NOT NULL,
    ingested_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_verified_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_threat_incidents_time ON public_threat_incidents(published_at);
CREATE INDEX IF NOT EXISTS idx_threat_incidents_state ON public_threat_incidents(state_code);
CREATE INDEX IF NOT EXISTS idx_threat_incidents_trust ON public_threat_incidents(trust_classification);
