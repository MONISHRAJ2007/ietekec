/**
 * IETE Student Forum – KEC
 * Supabase Configuration
 *
 * SETUP INSTRUCTIONS:
 * 1. Go to https://supabase.com and create an account / project
 * 2. In your project dashboard → Settings → API
 * 3. Copy "Project URL" and "anon public" key into the fields below
 * 4. Save this file — the entire website will connect automatically
 *
 * DO NOT commit this file with real credentials to a public repository.
 * Add assets/js/config.js to your .gitignore if needed.
 */

const SUPABASE_URL = 'https://wurtzerjwvigjfhsfvcl.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_dBOr-y_TJNJvioX_npv9oA_mOhm4tbN';

// Storage bucket names — match these with what you create in Supabase
const STORAGE_BUCKETS = {
  TEAM_IMAGES:       'team-images',
  GALLERY_IMAGES:    'gallery-images',
  EVENT_POSTERS:     'event-posters',
  ACHIEVEMENT_IMAGES:'achievement-images',
  FACULTY_IMAGES:    'faculty-images',
  DOCUMENTS:         'documents',
  EVENT_REPORTS:     'event-reports',
};

// Social media links
const SOCIAL_LINKS = {
  LINKEDIN:  'https://www.linkedin.com/in/iete-student-forum-152267417/',
  INSTAGRAM: 'https://www.instagram.com/isf.ece.kec?igsh=NzByNDJ4dHV0aHN4',
  INSTAGRAM: 'https://www.instagram.com/isf.ece.kec?igsh=NzByNDJ4dHV0aHN4',     
};

// Google Maps embed — KEC location
const MAPS_EMBED_URL = 'https://maps.app.goo.gl/ybgKju52RVaHR7j2A';
const MAPS_IFRAME_SRC = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3916.5!2d77.35!3d11.15!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zKEC+Kongu+Engineering+College!5e0!3m2!1sen!2sin!4v1';

export {
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  STORAGE_BUCKETS,
  SOCIAL_LINKS,
  MAPS_EMBED_URL,
  MAPS_IFRAME_SRC,
};
