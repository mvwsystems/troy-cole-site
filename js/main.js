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
    }, { threshold: 0.1 });

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
     FREEBIES: EMAIL GATE (used on freebies.html)
  ---------------------------------------------------------- */
  document.querySelectorAll('.freebie-download-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const card = btn.closest('.freebie-card');
      const gate = card ? card.querySelector('.freebie-gate') : null;
      if (gate) {
        e.preventDefault();
        gate.style.display = gate.style.display === 'flex' ? 'none' : 'flex';
      }
    });
  });

  document.querySelectorAll('.freebie-gate form').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = form.querySelector('input[type="email"]');
      if (!emailInput || !emailInput.value.includes('@')) {
        emailInput && emailInput.focus();
        return;
      }
      fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(new FormData(form)).toString()
      }).then(() => {
        form.closest('.freebie-gate').innerHTML = '<p style="color:var(--purple-light);font-size:13px;letter-spacing:0.1em;">✓ Check your email — download link sent!</p>';
      }).catch(() => {
        form.closest('.freebie-gate').innerHTML = '<p style="color:var(--purple-light);font-size:13px;letter-spacing:0.1em;">✓ Check your email — download link sent!</p>';
      });
    });
  });

});
