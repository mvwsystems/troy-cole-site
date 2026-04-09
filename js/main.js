/* ============================================================
   TROY COLE — SHARED JAVASCRIPT
   Handles: cursor, nav scroll, mobile menu, scroll reveal,
            active nav link highlighting
============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ----------------------------------------------------------
     CUSTOM CURSOR (desktop only)
  ---------------------------------------------------------- */
  const cursor = document.getElementById('cursor');
  const cursorRing = document.getElementById('cursorRing');

  if (cursor && cursorRing && window.matchMedia('(pointer: fine)').matches) {
    let mx = 0, my = 0, rx = 0, ry = 0;

    document.addEventListener('mousemove', e => {
      mx = e.clientX;
      my = e.clientY;
      cursor.style.left = mx + 'px';
      cursor.style.top = my + 'px';
    });

    function animateCursorRing() {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      cursorRing.style.left = rx + 'px';
      cursorRing.style.top = ry + 'px';
      requestAnimationFrame(animateCursorRing);
    }
    animateCursorRing();

    document.querySelectorAll('a, button').forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.style.width = '20px';
        cursor.style.height = '20px';
        cursorRing.style.width = '50px';
        cursorRing.style.height = '50px';
      });
      el.addEventListener('mouseleave', () => {
        cursor.style.width = '12px';
        cursor.style.height = '12px';
        cursorRing.style.width = '36px';
        cursorRing.style.height = '36px';
      });
    });
  }

  /* ----------------------------------------------------------
     NAV SCROLL STATE
  ---------------------------------------------------------- */
  const nav = document.getElementById('nav');
  if (nav) {
    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // run on load
  }

  /* ----------------------------------------------------------
     ACTIVE NAV LINK
  ---------------------------------------------------------- */
  const currentPath = window.location.pathname.replace(/\/$/, '');
  document.querySelectorAll('.nav-links a').forEach(link => {
    const linkPath = new URL(link.href).pathname.replace(/\/$/, '');
    if (linkPath === currentPath || (currentPath === '' && linkPath === '/index.html')) {
      link.classList.add('active');
    }
  });

  /* ----------------------------------------------------------
     MOBILE MENU
  ---------------------------------------------------------- */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    document.querySelectorAll('.mobile-nav-link').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ----------------------------------------------------------
     SCROLL REVEAL
  ---------------------------------------------------------- */
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          revealObserver.unobserve(e.target); // fire once
        }
      });
    }, { threshold: 0, rootMargin: '0px 0px -40px 0px' });

    reveals.forEach(el => revealObserver.observe(el));
  }

  /* ----------------------------------------------------------
     BLOG: FILTER TABS (used on blog/index.html)
  ---------------------------------------------------------- */
  const filterBtns = document.querySelectorAll('.blog-filter-btn');
  const blogCards = document.querySelectorAll('.blog-card');

  if (filterBtns.length && blogCards.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        blogCards.forEach(card => {
          const show = filter === 'all' || card.dataset.category === filter;
          card.style.display = show ? '' : 'none';
        });
      });
    });
  }

  /* ----------------------------------------------------------
     CONTACT FORMS — Netlify AJAX (no page navigation on submit)
  ---------------------------------------------------------- */
  document.querySelectorAll('form[data-netlify="true"]:not([name^="freebie"]):not([name="email-list"])').forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      if (btn) { btn.textContent = 'Sending...'; btn.disabled = true; }
      try {
        await fetch('/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams(new FormData(form)).toString()
        });
        form.innerHTML = '<p style="color:var(--purple-light);font-size:14px;letter-spacing:0.1em;line-height:1.6;">✓ Got it — we\'ll be in touch soon.</p>';
      } catch {
        if (btn) { btn.textContent = 'Send It →'; btn.disabled = false; }
      }
    });
  });

  /* ----------------------------------------------------------
     FREEBIES: KIT (CONVERTKIT) EMAIL GATE (used on freebies.html)
  ---------------------------------------------------------- */
  const KIT_API_KEY = 'r_N6cRcFv0R3rZnkU5gIIw';

  document.querySelectorAll('.freebie-download-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const card = btn.closest('.freebie-card');
      const gate = card ? card.querySelector('.freebie-gate') : null;
      if (gate) {
        const isOpen = gate.style.display === 'flex';
        gate.style.display = isOpen ? 'none' : 'flex';
        gate.style.flexDirection = 'column';
        gate.style.gap = '12px';
      }
    });
  });

  document.querySelectorAll('.freebie-card').forEach(card => {
    const btn = card.querySelector('.freebie-gate-submit');
    if (!btn) return;

    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      const gate = card.querySelector('.freebie-gate');
      const firstNameInput = gate.querySelector('input[name="first_name"]');
      const emailInput = gate.querySelector('input[name="email"]');
      const errorEl = gate.querySelector('.freebie-gate-error');
      const formId = card.dataset.kitFormId;
      const tag = parseInt(card.dataset.kitTag, 10);
      const redirect = card.dataset.redirect;

      const firstName = firstNameInput ? firstNameInput.value.trim() : '';
      const email = emailInput ? emailInput.value.trim() : '';

      if (!email.includes('@')) {
        emailInput && emailInput.focus();
        return;
      }

      btn.textContent = 'Sending...';
      btn.disabled = true;
      if (errorEl) errorEl.style.display = 'none';

      try {
        const res = await fetch(`https://api.convertkit.com/v3/forms/${formId}/subscribe`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            api_key: KIT_API_KEY,
            first_name: firstName,
            email: email,
            tags: [tag]
          })
        });
        const data = await res.json();
        if (res.ok && data.subscription) {
          window.location.href = redirect;
        } else {
          throw new Error(data.message || 'Something went wrong.');
        }
      } catch (err) {
        btn.textContent = 'Send It →';
        btn.disabled = false;
        if (errorEl) {
          errorEl.textContent = err.message || 'Something went wrong. Please try again.';
          errorEl.style.display = 'block';
        }
      }
    });
  });

});
