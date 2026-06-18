-- ============================================================
-- IETE Student Forum – KEC | Storage Buckets + RLS Policies
--
-- HOW TO USE:
-- 1. Supabase Dashboard → SQL Editor → New Query
-- 2. Paste and Run this AFTER running schema.sql
-- ============================================================

-- ============================================================
-- STEP 1: Create Storage Buckets
-- (These can also be created via Supabase Dashboard → Storage)
-- ============================================================

-- team-images: Profile photos for student office bearers
INSERT INTO storage.buckets (id, name, public)
VALUES ('team-images', 'team-images', true)
ON CONFLICT (id) DO NOTHING;

-- gallery-images: Gallery photos organized by album folder
INSERT INTO storage.buckets (id, name, public)
VALUES ('gallery-images', 'gallery-images', true)
ON CONFLICT (id) DO NOTHING;

-- event-posters: Event poster images
INSERT INTO storage.buckets (id, name, public)
VALUES ('event-posters', 'event-posters', true)
ON CONFLICT (id) DO NOTHING;

-- achievement-images: Certificate/award photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('achievement-images', 'achievement-images', true)
ON CONFLICT (id) DO NOTHING;

-- faculty-images: Faculty coordinator profile photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('faculty-images', 'faculty-images', true)
ON CONFLICT (id) DO NOTHING;

-- documents: General documents
INSERT INTO storage.buckets (id, name, public)
VALUES ('documents', 'documents', true)
ON CONFLICT (id) DO NOTHING;

-- event-reports: PDF reports for past events
INSERT INTO storage.buckets (id, name, public)
VALUES ('event-reports', 'event-reports', true)
ON CONFLICT (id) DO NOTHING;

-- announcement-brochures: Images for announcements
INSERT INTO storage.buckets (id, name, public)
VALUES ('announcement-brochures', 'announcement-brochures', true)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- STEP 2: Row Level Security (RLS) Policies
-- ============================================================

-- ── ANNOUNCEMENTS ──
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;

-- Anyone can read announcements (public website)
CREATE POLICY "Public read announcements"
  ON announcements FOR SELECT
  USING (true);

-- Only authenticated users (admins) can insert/update/delete
CREATE POLICY "Admin insert announcements"
  ON announcements FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin update announcements"
  ON announcements FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admin delete announcements"
  ON announcements FOR DELETE
  USING (auth.role() = 'authenticated');

-- ── UPCOMING EVENTS ──
ALTER TABLE upcoming_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read upcoming_events"
  ON upcoming_events FOR SELECT
  USING (true);

CREATE POLICY "Admin insert upcoming_events"
  ON upcoming_events FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin update upcoming_events"
  ON upcoming_events FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admin delete upcoming_events"
  ON upcoming_events FOR DELETE
  USING (auth.role() = 'authenticated');

-- ── PAST EVENTS ──
ALTER TABLE past_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read past_events"       ON past_events FOR SELECT USING (true);
CREATE POLICY "Admin insert past_events"      ON past_events FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admin update past_events"      ON past_events FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admin delete past_events"      ON past_events FOR DELETE USING (auth.role() = 'authenticated');

-- ── TEAM MEMBERS ──
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read team_members"      ON team_members FOR SELECT USING (true);
CREATE POLICY "Admin insert team_members"     ON team_members FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admin update team_members"     ON team_members FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admin delete team_members"     ON team_members FOR DELETE USING (auth.role() = 'authenticated');

-- ── FACULTY ──
ALTER TABLE faculty ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read faculty"           ON faculty FOR SELECT USING (true);
CREATE POLICY "Admin insert faculty"          ON faculty FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admin update faculty"          ON faculty FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admin delete faculty"          ON faculty FOR DELETE USING (auth.role() = 'authenticated');

-- ── ACHIEVEMENTS ──
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read achievements"      ON achievements FOR SELECT USING (true);
CREATE POLICY "Admin insert achievements"     ON achievements FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admin update achievements"     ON achievements FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admin delete achievements"     ON achievements FOR DELETE USING (auth.role() = 'authenticated');

-- ── GALLERY ──
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read gallery"           ON gallery FOR SELECT USING (true);
CREATE POLICY "Admin insert gallery"          ON gallery FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admin update gallery"          ON gallery FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admin delete gallery"          ON gallery FOR DELETE USING (auth.role() = 'authenticated');

-- ── TESTIMONIALS ──
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read testimonials"      ON testimonials FOR SELECT USING (is_active = true);
CREATE POLICY "Admin insert testimonials"     ON testimonials FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admin update testimonials"     ON testimonials FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admin delete testimonials"     ON testimonials FOR DELETE USING (auth.role() = 'authenticated');

-- ── CONTACT MESSAGES ──
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Anyone can insert (submit the contact form)
CREATE POLICY "Public insert contact_messages"
  ON contact_messages FOR INSERT
  WITH CHECK (true);

-- Only admins can view and manage messages
CREATE POLICY "Admin read contact_messages"
  ON contact_messages FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admin update contact_messages"
  ON contact_messages FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admin delete contact_messages"
  ON contact_messages FOR DELETE
  USING (auth.role() = 'authenticated');

-- ── SITE STATS ──
ALTER TABLE site_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read site_stats"        ON site_stats FOR SELECT USING (true);
CREATE POLICY "Admin update site_stats"       ON site_stats FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admin insert site_stats"       ON site_stats FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- ── ADMINS ──
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- Admins can only read their own record
CREATE POLICY "Admin read own record"
  ON admins FOR SELECT
  USING (auth.uid() = id);

-- ============================================================
-- STEP 3: Storage Bucket RLS Policies
-- ============================================================

-- PUBLIC READ for all image buckets
CREATE POLICY "Public read team-images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'team-images');

CREATE POLICY "Public read gallery-images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'gallery-images');

CREATE POLICY "Public read event-posters"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'event-posters');

CREATE POLICY "Public read achievement-images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'achievement-images');

CREATE POLICY "Public read faculty-images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'faculty-images');

CREATE POLICY "Public read documents"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'documents');

CREATE POLICY "Public read event-reports"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'event-reports');

CREATE POLICY "Public read announcement-brochures"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'announcement-brochures');

-- AUTHENTICATED WRITE (upload, update, delete) for all buckets
CREATE POLICY "Admin upload team-images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'team-images' AND auth.role() = 'authenticated');

CREATE POLICY "Admin upload gallery-images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'gallery-images' AND auth.role() = 'authenticated');

CREATE POLICY "Admin upload event-posters"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'event-posters' AND auth.role() = 'authenticated');

CREATE POLICY "Admin upload achievement-images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'achievement-images' AND auth.role() = 'authenticated');

CREATE POLICY "Admin upload faculty-images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'faculty-images' AND auth.role() = 'authenticated');

CREATE POLICY "Admin upload documents"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'documents' AND auth.role() = 'authenticated');

CREATE POLICY "Admin upload event-reports"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'event-reports' AND auth.role() = 'authenticated');

CREATE POLICY "Admin upload announcement-brochures"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'announcement-brochures' AND auth.role() = 'authenticated');

-- UPDATE and DELETE for authenticated users
CREATE POLICY "Admin update storage objects"
  ON storage.objects FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admin delete storage objects"
  ON storage.objects FOR DELETE
  USING (auth.role() = 'authenticated');
