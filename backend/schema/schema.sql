-- ====================================================================
-- CYBERPEHRA PUBLIC CYBER-INTELLIGENCE DATABASE SCHEMA
-- Strict Zero User-Data Storage Paradigm (0-Day Data Retention)
-- Compatibility: Supabase / PostgreSQL Free Tier
-- ====================================================================

-- Enable UUID extension if available
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- --------------------------------------------------------------------
-- 1. PUBLIC SCAM ENCYCLOPEDIA TABLE
-- Verified cyber scam patterns, vectors, and defense guidelines in India.
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public_scams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(100) UNIQUE NOT NULL,
    title_en VARCHAR(255) NOT NULL,
    title_hi VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL, -- e.g. FINANCIAL, PHISHING, SEXTORTION, JOB_FRAUD, APK_MALWARE
    severity VARCHAR(20) DEFAULT 'HIGH', -- CRITICAL, HIGH, MEDIUM
    description_en TEXT NOT NULL,
    description_hi TEXT NOT NULL,
    red_flags JSONB NOT NULL DEFAULT '[]'::jsonb,
    prevention_steps JSONB NOT NULL DEFAULT '[]'::jsonb,
    target_demographics VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for category search
CREATE INDEX IF NOT EXISTS idx_public_scams_category ON public_scams(category);

-- --------------------------------------------------------------------
-- 2. INDIAN STATE CYBER TELEMETRY TABLE
-- Verified public state incident metrics, helpline, and cyber cell info.
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS state_cyber_telemetry (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    state_code VARCHAR(10) UNIQUE NOT NULL, -- e.g. IN-DL, IN-MH, IN-KA
    state_name VARCHAR(100) NOT NULL,
    financial_loss_cr NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    reported_cases INT NOT NULL DEFAULT 0,
    nodal_helpline VARCHAR(50) DEFAULT '1930',
    nodal_email VARCHAR(100),
    cyber_cell_address TEXT,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- --------------------------------------------------------------------
-- 3. CERT-In & NCCC THREAT ADVISORIES TABLE
-- Verified public national threat advisories & security warnings.
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS threat_advisories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    advisory_code VARCHAR(50) UNIQUE NOT NULL, -- e.g. CIAD-2026-0089
    title VARCHAR(255) NOT NULL,
    severity VARCHAR(20) NOT NULL DEFAULT 'HIGH',
    source VARCHAR(100) NOT NULL, -- e.g. CERT-In, NCCC, RBI
    summary TEXT NOT NULL,
    action_required TEXT NOT NULL,
    published_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- --------------------------------------------------------------------
-- 4. OFFICIAL EMERGENCY 1930 BANK & HELPLINE DIRECTORY TABLE
-- Verified public nodal bank freeze desk contacts and emergency numbers.
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS emergency_directory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category VARCHAR(50) NOT NULL, -- BANK, UPI, TELECOM, GOV_AGENCY
    entity_name VARCHAR(100) NOT NULL,
    tollfree_number VARCHAR(50) NOT NULL,
    emergency_action_url TEXT,
    reporting_instructions TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_emergency_directory_category ON emergency_directory(category);
