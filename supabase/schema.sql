-- ============================================================
-- IETE Student Forum – KEC | Complete Database Schema
-- Supabase PostgreSQL
--
-- HOW TO USE:
-- 1. Go to your Supabase project dashboard
-- 2. Click on "SQL Editor" in the left sidebar
-- 3. Click "New Query"
-- 4. Paste this entire file contents
-- 5. Click "Run" (or press Ctrl+Enter)
-- ============================================================

-- ── Enable UUID extension ──
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- TABLE: announcements
-- Stores club notices, event announcements, membership drives
-- ============================================================
CREATE TABLE IF NOT EXISTS announcements (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title          TEXT NOT NULL,
  content        TEXT,
  category       TEXT DEFAULT 'Notice'
                 CHECK (category IN ('Notice','Event','Membership','Workshop','Competition')),
  is_pinned      BOOLEAN DEFAULT FALSE,
  brochure_image TEXT,
  redirect_url   TEXT,
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  updated_at     TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast filtering
CREATE INDEX IF NOT EXISTS idx_announcements_category ON announcements(category);
CREATE INDEX IF NOT EXISTS idx_announcements_created   ON announcements(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_announcements_pinned    ON announcements(is_pinned);

-- ============================================================
-- TABLE: upcoming_events
-- Stores future events visible on the Events page
-- ============================================================
CREATE TABLE IF NOT EXISTS upcoming_events (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title            TEXT NOT NULL,
  description      TEXT,
  event_type       TEXT DEFAULT 'Event'
                   CHECK (event_type IN ('Workshop','Seminar','Technical Talk','Competition','Industrial Visit','Event')),
  event_date       DATE,
  event_time       TEXT,               -- e.g. "10:00 AM"
  venue            TEXT,
  poster_url       TEXT,               -- auto-generated from Storage upload
  registration_url TEXT,               -- optional external registration link
  details_url      TEXT,               -- optional detailed info link
  is_active        BOOLEAN DEFAULT TRUE,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_upcoming_events_date ON upcoming_events(event_date ASC);
CREATE INDEX IF NOT EXISTS idx_upcoming_events_type ON upcoming_events(event_type);

-- ============================================================
-- TABLE: past_events
-- Stores completed events with reports and photos
-- ============================================================
CREATE TABLE IF NOT EXISTS past_events (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title        TEXT NOT NULL,
  description  TEXT,
  event_type   TEXT DEFAULT 'Event'
               CHECK (event_type IN ('Workshop','Seminar','Technical Talk','Competition','Industrial Visit','Event')),
  event_date   DATE,
  venue        TEXT,
  poster_url   TEXT,               -- auto-generated from Storage upload
  report_url   TEXT,               -- PDF report link (PDF URL is fine)
  speakers     TEXT,               -- comma-separated or JSON string
  outcomes     TEXT,               -- brief outcomes text
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_past_events_date ON past_events(event_date DESC);
CREATE INDEX IF NOT EXISTS idx_past_events_type ON past_events(event_type);

-- ============================================================
-- TABLE: team_members
-- Student office bearers and executive members
-- ============================================================
CREATE TABLE IF NOT EXISTS team_members (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name          TEXT NOT NULL,
  role          TEXT NOT NULL
                CHECK (role IN ('Chairman','Vice Chairman','Secretary','Treasurer',
                                'Joint Secretary','Technical Coordinator','Executive Member','Other')),
  department    TEXT,               -- e.g. "B.E. ECE III Year"
  bio           TEXT,
  image_url     TEXT,               -- auto-generated from Storage upload
  linkedin_url  TEXT,
  github_url    TEXT,
  instagram_url TEXT,
  display_order INT DEFAULT 99,     -- lower number = appears first
  is_active     BOOLEAN DEFAULT TRUE,
  year          TEXT,               -- academic year e.g. "2024-25"
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_team_order    ON team_members(display_order ASC);
CREATE INDEX IF NOT EXISTS idx_team_role     ON team_members(role);
CREATE INDEX IF NOT EXISTS idx_team_active   ON team_members(is_active);

-- ============================================================
-- TABLE: faculty
-- Faculty coordinators and advisors
-- ============================================================
CREATE TABLE IF NOT EXISTS faculty (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name         TEXT NOT NULL,
  designation  TEXT,               -- e.g. "Associate Professor"
  department   TEXT DEFAULT 'Electronics and Communication Engineering',
  email        TEXT,
  phone        TEXT,
  image_url    TEXT,               -- auto-generated from Storage upload
  role         TEXT DEFAULT 'coordinator'
               CHECK (role IN ('coordinator','advisor','member')),
  bio          TEXT,
  display_order INT DEFAULT 99,
  is_active    BOOLEAN DEFAULT TRUE,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_faculty_role   ON faculty(role);
CREATE INDEX IF NOT EXISTS idx_faculty_active ON faculty(is_active);

-- ============================================================
-- TABLE: achievements
-- Student and faculty achievements
-- ============================================================
CREATE TABLE IF NOT EXISTS achievements (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title        TEXT NOT NULL,
  author_name  TEXT,               -- student or faculty name
  type         TEXT DEFAULT 'student'
               CHECK (type IN ('student','faculty')),
  category     TEXT DEFAULT 'Competition'
               CHECK (category IN ('Hackathon','Competition','Publication','Conference','Project','Other')),
  achievement_date DATE,
  description  TEXT,
  image_url    TEXT,               -- certificate/award image, auto-generated
  is_featured  BOOLEAN DEFAULT FALSE,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_achieve_type     ON achievements(type);
CREATE INDEX IF NOT EXISTS idx_achieve_category ON achievements(category);
CREATE INDEX IF NOT EXISTS idx_achieve_date     ON achievements(achievement_date DESC);

-- ============================================================
-- TABLE: gallery
-- Photo gallery images organized by album
-- ============================================================
CREATE TABLE IF NOT EXISTS gallery (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  image_url    TEXT NOT NULL,      -- public URL from Supabase Storage
  album        TEXT DEFAULT 'General'
               CHECK (album IN ('Workshops','Seminars','Symposiums','Industrial Visits','Club Activities','General')),
  description  TEXT,
  storage_path TEXT,               -- bucket path for deletion
  display_order INT DEFAULT 99,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_gallery_album   ON gallery(album);
CREATE INDEX IF NOT EXISTS idx_gallery_created ON gallery(created_at DESC);

-- ============================================================
-- TABLE: testimonials
-- Student feedback / testimonials for homepage carousel
-- ============================================================
CREATE TABLE IF NOT EXISTS testimonials (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name       TEXT NOT NULL,
  role       TEXT,               -- e.g. "Final Year ECE Student" or "Alumni 2023"
  content    TEXT NOT NULL,
  avatar_url TEXT,               -- optional photo
  is_active  BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABLE: contact_messages
-- Contact form submissions from visitors
-- ============================================================
CREATE TABLE IF NOT EXISTS contact_messages (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name       TEXT NOT NULL,
  email      TEXT NOT NULL,
  phone      TEXT,
  subject    TEXT NOT NULL,
  message    TEXT NOT NULL,
  category   TEXT DEFAULT 'General',
  is_read    BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_messages_read    ON contact_messages(is_read);
CREATE INDEX IF NOT EXISTS idx_messages_created ON contact_messages(created_at DESC);

-- ============================================================
-- TABLE: site_stats
-- Editable stats for homepage counter section
-- ============================================================
CREATE TABLE IF NOT EXISTS site_stats (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  members_count     INT DEFAULT 250,
  events_count      INT DEFAULT 60,
  workshops_count   INT DEFAULT 30,
  achievements_count INT DEFAULT 100,
  years_count       INT DEFAULT 10,
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default row (only one row needed)
INSERT INTO site_stats (id, members_count, events_count, workshops_count, achievements_count, years_count)
VALUES (uuid_generate_v4(), 250, 60, 30, 100, 10)
ON CONFLICT DO NOTHING;

-- ============================================================
-- TABLE: admins
-- Tracks which Supabase Auth users are admins (optional extended info)
-- Note: Authentication itself is handled by Supabase Auth.
--       Create admin users via Supabase Dashboard → Authentication → Users
-- ============================================================
CREATE TABLE IF NOT EXISTS admins (
  id         UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email      TEXT NOT NULL,
  role       TEXT DEFAULT 'admin' CHECK (role IN ('admin','super_admin')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- AUTO-UPDATE TRIGGERS (updated_at)
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_announcements_updated   BEFORE UPDATE ON announcements    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_upcoming_updated        BEFORE UPDATE ON upcoming_events  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_past_updated            BEFORE UPDATE ON past_events      FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_team_updated            BEFORE UPDATE ON team_members     FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_faculty_updated         BEFORE UPDATE ON faculty          FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_achievements_updated    BEFORE UPDATE ON achievements     FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_site_stats_updated      BEFORE UPDATE ON site_stats       FOR EACH ROW EXECUTE FUNCTION update_updated_at();
