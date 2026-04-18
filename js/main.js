/* ============================================================
   Excelsior BI — Site JavaScript
   ============================================================ */

// ---- Mobile nav toggle ----
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');

if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
    // Animate hamburger to X
    const spans = hamburger.querySelectorAll('span');
    const isOpen = mobileMenu.classList.contains('open');
    if (isOpen) {
      spans[0].style.transform = 'translateY(7px) rotate(45deg)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
    } else {
      spans[0].style.transform = '';
      spans[1].style.opacity = '';
      spans[2].style.transform = '';
    }
  });

  // Close menu when a link is clicked
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      const spans = hamburger.querySelectorAll('span');
      spans[0].style.transform = '';
      spans[1].style.opacity = '';
      spans[2].style.transform = '';
    });
  });
}

// ---- Active nav link (scroll-based for single-page) ----
(function () {
  const sectionIds = ['home', 'about', 'services', 'portfolio', 'contact'];
  const navLinks = document.querySelectorAll('.nav-link');

  function updateActiveNav() {
    const navHeight = 80;
    let activeId = sectionIds[0];

    sectionIds.forEach(id => {
      const el = document.getElementById(id);
      if (el && el.getBoundingClientRect().top <= navHeight) {
        activeId = id;
      }
    });

    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + activeId);
    });
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });
  updateActiveNav();
})();

// ---- Visuals category filter ----
(function () {
  const filterBtns      = document.querySelectorAll('.filter-btn');
  const groups          = document.querySelectorAll('.visuals-group');
  const contributionsEl = document.getElementById('contributions-panel');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;

      // Show/hide real-world scenarios panel
      if (contributionsEl) {
        contributionsEl.style.display = (filter === 'all' || filter === 'scenarios') ? '' : 'none';
      }

      // Show/hide visuals groups
      groups.forEach(g => {
        if (filter === 'scenarios') {
          g.style.display = 'none';
        } else {
          g.style.display = (filter === 'all' || g.dataset.group === filter) ? '' : 'none';
        }
      });
    });
  });
})();

// ---- Service expand/collapse ----
(function () {
  const btns = document.querySelectorAll('.service-expand-btn');

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.dataset.detail;
      const detail = document.getElementById(targetId);
      const isOpen = detail.classList.contains('open');

      // Close all panels and reset all buttons
      document.querySelectorAll('.service-detail').forEach(d => d.classList.remove('open'));
      btns.forEach(b => {
        b.setAttribute('aria-expanded', 'false');
        b.querySelector('span').textContent = '+';
      });

      // Open the clicked panel if it was closed
      if (!isOpen) {
        detail.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
        btn.querySelector('span').textContent = '\u2212';
      }
    });
  });
})();

// ---- Lightbox ----
(function () {
  const overlay   = document.getElementById('lightbox');
  const lightImg  = document.getElementById('lightbox-img');
  const closeBtn  = document.getElementById('lightbox-close');

  if (!overlay) return;

  function openLightbox(src, alt) {
    lightImg.src = src;
    lightImg.alt = alt || '';
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
    lightImg.src = '';
  }

  document.querySelectorAll('.lightbox-trigger').forEach(btn => {
    btn.addEventListener('click', () => {
      openLightbox(btn.dataset.lightboxSrc, btn.dataset.lightboxAlt);
    });
  });

  closeBtn.addEventListener('click', closeLightbox);

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });
})();

// ---- Contact form (Formspree AJAX) ----
const contactForm = document.getElementById('contact-form');
const formSuccess = document.getElementById('form-success');

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';

    try {
      const response = await fetch(contactForm.action, {
        method: 'POST',
        body: new FormData(contactForm),
        headers: { Accept: 'application/json' }
      });

      if (response.ok) {
        contactForm.style.display = 'none';
        if (formSuccess) formSuccess.style.display = 'block';
      } else {
        throw new Error('Server error');
      }
    } catch {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
      alert('Something went wrong. Please try again, or reach out via LinkedIn.');
    }
  });
}
