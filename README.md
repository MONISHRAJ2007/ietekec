# IETE Student Forum – Kongu Engineering College

**Official Website** of the IETE (Institution of Electronics and Telecommunication Engineers) Student Forum, Department of Electronics and Communication Engineering, Kongu Engineering College.

> *"Innovating Electronics, Empowering Engineers"*

---

## 🌐 Live Preview

Open `index.html` in any modern browser to preview the website locally.

For the backend features (dynamic content), configure Supabase credentials first — see [SUPABASE_SETUP.md](./SUPABASE_SETUP.md).

---

## 🗂 Project Structure

```
iete/
├── index.html              # Home Page
├── about.html              # About IETE
├── department.html         # ECE Department
├── events.html             # Events (Upcoming + Past)
├── team.html               # Team (Faculty + Students)
├── achievements.html       # Achievements
├── gallery.html            # Photo Gallery
├── announcements.html      # Announcements Board
├── contact.html            # Contact + Map
│
├── admin/                  # Admin Dashboard
│   ├── login.html          # Admin Login
│   ├── dashboard.html      # Overview
│   ├── announcements.html  # Announcements CRUD
│   ├── events.html         # Events CRUD (Upcoming + Past)
│   ├── gallery.html        # Gallery Upload
│   ├── team.html           # Team Members CRUD
│   ├── faculty.html        # Faculty CRUD
│   ├── achievements.html   # Achievements CRUD
│   ├── messages.html       # Contact Messages
│   └── settings.html       # Site Stats + Testimonials
│
├── assets/
│   ├── css/
│   │   ├── variables.css   # Design tokens (colors, fonts, spacing)
│   │   ├── base.css        # CSS reset + base styles
│   │   ├── components.css  # Reusable UI components
│   │   ├── animations.css  # Scroll reveal + animations
│   │   ├── navbar.css      # Navigation styles
│   │   ├── footer.css      # Footer styles
│   │   └── admin.css       # Admin dashboard styles
│   │
│   ├── js/
│   │   ├── config.js           # ← CONFIGURE THIS with your Supabase credentials
│   │   ├── supabase-client.js  # Supabase client init + helpers
│   │   ├── auth.js             # Authentication helpers
│   │   ├── navbar.js           # Navbar + Footer rendering
│   │   ├── animations.js       # Scroll reveal, counters, carousel, lightbox
│   │   └── imageUpload.js      # Image upload + compression component
│   │
│   └── images/
│       ├── kec-logo.jpg        # Kongu Engineering College logo
│       ├── iete-logo.png       # IETE logo
│       ├── dept-photo.jpg      # ECE Department building photo
│       └── hero-illustration.png  # Home page hero image
│
├── supabase/
│   ├── schema.sql          # Complete DB schema (run this first)
│   └── rls-policies.sql    # Storage buckets + RLS policies (run second)
│
├── SUPABASE_SETUP.md       # Step-by-step Supabase setup guide
├── DEPLOYMENT.md           # Deployment guide for Vercel/Netlify
└── README.md               # This file
```

---

## 🚀 Quick Start

### 1. Configure Supabase

Follow [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) — takes ~20 minutes.

Then edit `assets/js/config.js`:
```javascript
const SUPABASE_URL = 'https://YOUR_PROJECT_ID.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR_ANON_KEY';
```

### 2. Open the Website

Simply double-click `index.html` — no build tool or server required.

> ⚠️ **Note**: ES Modules require a local server if you open via `file://` protocol.
> Use VS Code's **Live Server** extension or Python's simple server:
> ```bash
> cd d:\project\iete
> python -m http.server 8080
> # Then open: http://localhost:8080
> ```

### 3. Admin Access

1. Create admin user in Supabase Dashboard → Authentication → Users
2. Go to `/admin/login.html`
3. Enter credentials → Dashboard opens

---

## 🎨 Design System

| Token | Value |
|---|---|
| Primary Color | `#0F2B5B` (Navy Blue) |
| Secondary Color | `#F4A300` (Amber Gold) |
| Background | `#FFFFFF` |
| Section Alt BG | `#F5F7FA` |
| Heading Font | Poppins |
| Body Font | Inter |

---

## 🔧 Technology Stack

| Layer | Technology |
|---|---|
| Frontend | HTML5, CSS3, Vanilla JavaScript (ES Modules) |
| Backend | Supabase (PostgreSQL, Auth, Storage) |
| Fonts | Google Fonts (Poppins + Inter) |
| Icons | Emoji-based (no external icon library) |
| Images | Direct upload via Supabase Storage |
| Hosting | Vercel / Netlify (see DEPLOYMENT.md) |

---

## 📋 Pages Summary

| Page | Dynamic Data Source |
|---|---|
| Home | Supabase: announcements, upcoming_events, testimonials, site_stats |
| About IETE | Static content |
| ECE Department | Static content |
| Events | Supabase: upcoming_events, past_events |
| Team | Supabase: team_members, faculty |
| Achievements | Supabase: achievements |
| Gallery | Supabase: gallery |
| Announcements | Supabase: announcements |
| Contact | Supabase: contact_messages (write), faculty (read) |

---

## 🔒 Admin Dashboard Features

| Feature | Description |
|---|---|
| Announcements CRUD | Add/Edit/Delete notices and events with pinning |
| Events CRUD | Manage upcoming and past events with poster upload |
| Gallery Upload | Bulk image upload with drag-and-drop and album folders |
| Team Management | Add/Edit student office bearers with profile photo upload |
| Faculty Management | Manage faculty coordinators with photo upload |
| Achievement Tracking | Track student and faculty achievements with certificate upload |
| Message Inbox | View, mark read, and export contact form submissions |
| Site Settings | Update homepage stat counters and manage testimonials |

### Image Upload Policy
> **No URL input fields anywhere in the admin dashboard.**
> All images are uploaded via file picker or drag-and-drop → compressed client-side → uploaded to Supabase Storage → URL auto-generated and saved.

---

## 🗃️ Database Tables

| Table | Purpose |
|---|---|
| `announcements` | Club notices and announcements |
| `upcoming_events` | Future events with posters |
| `past_events` | Completed events with reports |
| `team_members` | Student office bearers |
| `faculty` | Faculty coordinators |
| `achievements` | Student and faculty achievements |
| `gallery` | Photo gallery organized by album |
| `testimonials` | Student feedback for homepage |
| `contact_messages` | Contact form submissions |
| `site_stats` | Editable homepage statistics |
| `admins` | Admin user registry |

---

## 🛡️ Security

- Row Level Security (RLS) enabled on all tables
- Public can only **read** content tables
- Only authenticated admins can **insert/update/delete**
- Contact messages can be **submitted by anyone** but only **read by admins**
- Supabase Auth manages session persistence and logout

---

## 📞 Contact

**IETE Student Forum**
Department of Electronics & Communication Engineering
Kongu Engineering College, Perundurai, Erode – 638 060, Tamil Nadu

- 🔗 LinkedIn: [IETE Student Forum](https://www.linkedin.com/in/iete-student-forum-152267417/)
- 📷 Instagram: [Update in config.js]
- ▶️ YouTube: [Update in config.js]

---

## 🤝 Future Coordinators

This website is designed for easy maintenance:
1. **No coding needed** for daily content updates — use the Admin Dashboard
2. To change contact info/social links → edit `assets/js/config.js` and `assets/js/navbar.js`
3. To replace logos → drop new files as `assets/images/kec-logo.jpg` and `assets/images/iete-logo.png`
4. To change colors → edit `assets/css/variables.css`

---

*Built with ❤️ for the IETE Student Forum, Kongu Engineering College*
