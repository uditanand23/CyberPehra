-- ====================================================================
-- CYBERPEHRA ROW LEVEL SECURITY (RLS) POLICIES
-- Ensures public read-only access while restricting INSERT/UPDATE/DELETE
-- exclusively to backend service_role credentials.
-- ====================================================================

-- 1. public_scams table
ALTER TABLE public_scams ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read_only" ON public_scams FOR SELECT USING (true);

-- 2. state_cyber_telemetry table
ALTER TABLE state_cyber_telemetry ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read_only" ON state_cyber_telemetry FOR SELECT USING (true);

-- 3. threat_advisories table
ALTER TABLE threat_advisories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read_only" ON threat_advisories FOR SELECT USING (true);

-- 4. emergency_directory table
ALTER TABLE emergency_directory ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read_only" ON emergency_directory FOR SELECT USING (true);

-- 5. trusted_intel_sources table
ALTER TABLE trusted_intel_sources ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read_only" ON trusted_intel_sources FOR SELECT USING (true);

-- 6. public_threat_incidents table
ALTER TABLE public_threat_incidents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read_only" ON public_threat_incidents FOR SELECT USING (true);
