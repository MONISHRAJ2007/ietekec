/**
 * IETE Student Forum – KEC
 * Navbar Component
 * Handles sticky scroll, mobile menu, active link highlighting, back-to-top
 */

export function initNavbar() {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  const backToTop = document.getElementById('back-to-top');
  const scrollProgress = document.getElementById('scroll-progress');

  if (!navbar) return;

  // ── Active Page Highlighting ──
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navbar__nav-link, .navbar__mobile-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href && (href === currentPath || href.endsWith(currentPath))) {
      link.classList.add('active');
    }
  });

  // ── Scroll Effects ──
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    // Scrolled class for shadow
    if (scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Back-to-top button
    if (backToTop) {
      if (scrollY > 400) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    }

    // Scroll progress bar
    if (scrollProgress) {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
      scrollProgress.style.width = `${progress}%`;
    }

    lastScroll = scrollY;
  }, { passive: true });

  // ── Hamburger Menu ──
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.toggle('active');
      mobileMenu.classList.toggle('active', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close on link click
    mobileMenu.querySelectorAll('.navbar__mobile-link').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!navbar.contains(e.target) && !mobileMenu.contains(e.target)) {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  // ── Back to Top ──
  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

/**
 * Create and inject the navbar HTML into #navbar-placeholder
 * Pass the page root prefix (e.g. './' for root, '../' for admin pages)
 */
export function renderNavbar(prefix = './') {
  const placeholder = document.getElementById('navbar-placeholder');
  if (!placeholder) return;

  placeholder.innerHTML = `
    <div id="scroll-progress" class="scroll-progress"></div>
    <nav id="navbar" class="navbar" aria-label="Main navigation">
      <div class="navbar__inner">
        <a href="${prefix}index.html" class="navbar__brand" aria-label="IETE Student Forum Home">
          <img src="${prefix}assets/images/kec-logo.png" alt="KEC Logo" class="navbar__logo" onerror="this.style.display='none'">
          <div class="navbar__logo-divider"></div>
          <img src="${prefix}assets/images/iete-logo.png" alt="IETE Logo" class="navbar__logo" onerror="this.style.display='none'">
          <div class="navbar__brand-text">
            <span class="navbar__brand-title">IETE Student Forum</span>
            <span class="navbar__brand-subtitle">Kongu Engineering College</span>
          </div>
        </a>

        <ul class="navbar__nav" role="list">
          <li><a href="${prefix}index.html" class="navbar__nav-link">Home</a></li>
          <li><a href="${prefix}about.html" class="navbar__nav-link">About IETE</a></li>
          <li><a href="${prefix}department.html" class="navbar__nav-link">ECE Dept.</a></li>
          <li><a href="${prefix}events.html" class="navbar__nav-link">Events</a></li>
          <li><a href="${prefix}team.html" class="navbar__nav-link">Team</a></li>
          <li><a href="${prefix}achievements.html" class="navbar__nav-link">Achievements</a></li>
          <li><a href="${prefix}gallery.html" class="navbar__nav-link">Gallery</a></li>
          <li><a href="${prefix}announcements.html" class="navbar__nav-link">Announcements</a></li>
          <li><a href="${prefix}contact.html" class="navbar__nav-link">Contact</a></li>
        </ul>

        <a href="${prefix}admin/login.html" class="navbar__admin-btn" aria-label="Admin Login">
          <span>⚙</span> Admin
        </a>

        <button class="navbar__hamburger" id="hamburger" aria-label="Toggle menu" aria-expanded="false">
          <span class="navbar__hamburger-line"></span>
          <span class="navbar__hamburger-line"></span>
          <span class="navbar__hamburger-line"></span>
        </button>
      </div>
    </nav>

    <div class="navbar__mobile" id="mobile-menu" role="navigation" aria-label="Mobile navigation">
      <ul class="navbar__mobile-nav" role="list">
        <li><a href="${prefix}index.html" class="navbar__mobile-link">🏠 Home</a></li>
        <li><a href="${prefix}about.html" class="navbar__mobile-link">ℹ️ About IETE</a></li>
        <li><a href="${prefix}department.html" class="navbar__mobile-link">🏛️ ECE Department</a></li>
        <li><a href="${prefix}events.html" class="navbar__mobile-link">📅 Events</a></li>
        <li><a href="${prefix}team.html" class="navbar__mobile-link">👥 Team</a></li>
        <li><a href="${prefix}achievements.html" class="navbar__mobile-link">🏆 Achievements</a></li>
        <li><a href="${prefix}gallery.html" class="navbar__mobile-link">🖼️ Gallery</a></li>
        <li><a href="${prefix}announcements.html" class="navbar__mobile-link">📢 Announcements</a></li>
        <li><a href="${prefix}contact.html" class="navbar__mobile-link">📞 Contact</a></li>
      </ul>
      <a href="${prefix}admin/login.html" class="navbar__mobile-admin">⚙ Admin Login</a>
    </div>
  `;

  initNavbar();
}

/**
 * Create and inject the footer HTML
 */
export function renderFooter(prefix = './') {
  const placeholder = document.getElementById('footer-placeholder');
  if (!placeholder) return;

  const year = new Date().getFullYear();

  placeholder.innerHTML = `
    <footer class="footer" role="contentinfo">
      <div class="container">
        <div class="footer__top">
          <div class="footer__brand">
            <div class="footer__logos">
              <img src="${prefix}assets/images/kec-logo.png" alt="KEC Logo" class="footer__logo footer__logo--kec" height="52" onerror="this.style.display='none'">
              <div class="footer__logo-divider"></div>
              <img src="${prefix}assets/images/iete-logo.png" alt="IETE Logo" class="footer__logo" height="52" onerror="this.style.display='none'">
            </div>
            <div class="footer__tagline">IETE Student Forum – KEC</div>
            <p class="footer__desc">
              Institution of Electronics and Telecommunication Engineers Student Forum,
              Department of Electronics and Communication Engineering,
              Kongu Engineering College, Erode, Tamil Nadu.
            </p>
            <div class="footer__socials">
              <a href="https://www.linkedin.com/in/iete-student-forum-152267417/" target="_blank" rel="noopener" class="footer__social-link" aria-label="LinkedIn">in</a>
              <a href="https://www.instagram.com/isf.ece.kec?igsh=NzByNDJ4dHV0aHN4" target="_blank" rel="noopener" class="footer__social-link" aria-label="Instagram">📷</a>
              <a href="https://www.instagram.com/isf.ece.kec?igsh=NzByNDJ4dHV0aHN4" target="_blank" rel="noopener" class="footer__social-link" aria-label="Instagram">▶</a>
            </div>
          </div>

          <div>
            <div class="footer__col-title">Quick Links</div>
            <div class="footer__links">
              <a href="${prefix}index.html" class="footer__link">Home</a>
              <a href="${prefix}events.html" class="footer__link">Events</a>
              <a href="${prefix}team.html" class="footer__link">Our Team</a>
              <a href="${prefix}achievements.html" class="footer__link">Achievements</a>
              <a href="${prefix}gallery.html" class="footer__link">Gallery</a>
              <a href="${prefix}contact.html" class="footer__link">Contact Us</a>
            </div>
          </div>

          <div>
            <div class="footer__col-title">IETE Links</div>
            <div class="footer__links">
              <a href="https://www.iete.org" target="_blank" rel="noopener" class="footer__link">IETE India</a>
              <a href="${prefix}about.html" class="footer__link">About IETE</a>
              <a href="${prefix}announcements.html" class="footer__link">Announcements</a>
              <a href="${prefix}department.html" class="footer__link">ECE Department</a>
            </div>
          </div>

          <div>
            <div class="footer__col-title">Contact</div>
            <div class="footer__contact-item">
              <span class="footer__contact-icon">📍</span>
              <span>Dept. of ECE, Kongu Engineering College, Perundurai, Erode – 638 060, Tamil Nadu.</span>
            </div>
            <div class="footer__contact-item">
              <span class="footer__contact-icon">✉</span>
              <span>isfece.kongu@gmail.com</span>
            </div>
          </div>
        </div>

        <div class="footer__bottom">
          <div class="footer__copyright">
          <a 
          href="https://www.linkedin.com/in/monishraj-k-5aa1a0329/"
            target="_blank"
            rel="noopener noreferrer"
            style="color: inherit; text-decoration: none;"
          >
            © ${year} Monishraj K, +91 7603831803. All rights reserved.
          </a>
        </div>
          <div class="footer__bottom-links">
            <a href="${prefix}admin/login.html" class="footer__bottom-link">Admin</a>
          </div>
        </div>
      </div>
    </footer>
    <button id="back-to-top" class="back-to-top" aria-label="Back to top">↑</button>
  `;
}
