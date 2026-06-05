/* ============================================
   VORTEX DESIGN LAB — PORTFOLIO SCRIPTS
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ============================================
  // 1. HEADER SCROLL EFFECT
  // ============================================
  const header = document.getElementById('header');
  const backToTop = document.getElementById('backToTop');
  const navLinks = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('section[id]');

  const onScroll = () => {
    const scrollY = window.scrollY;

    // Header glass effect
    if (scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Back to top button
    if (scrollY > 600) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }

    // Update active nav link based on scroll position
    updateActiveNavLink();
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // Initial check

  // Back to top
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });


  // ============================================
  // 2. ACTIVE NAV LINK TRACKING
  // ============================================

  function updateActiveNavLink() {
    const scrollY = window.scrollY + 150;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }


  // ============================================
  // 3. MOBILE MENU
  // ============================================
  const mobileToggle = document.getElementById('mobileToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = mobileMenu.querySelectorAll('a');

  mobileToggle.addEventListener('click', () => {
    mobileToggle.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileToggle.classList.remove('active');
      mobileMenu.classList.remove('active');
      document.body.style.overflow = '';
    });
  });


  // ============================================
  // 4. SCROLL REVEAL ANIMATIONS
  // ============================================
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));


  // ============================================
  // 5. COUNTER ANIMATION (About Section)
  // ============================================
  const counters = document.querySelectorAll('[data-count]');

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-count'));
        animateCounter(el, target);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => counterObserver.observe(counter));

  function animateCounter(el, target) {
    const duration = 2000;
    const startTime = performance.now();

    function tick(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      el.textContent = Math.floor(eased * target) + (target >= 100 ? '+' : '+');
      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    }

    requestAnimationFrame(tick);
  }


  // ============================================
  // 6. SKILL PROGRESS RING ANIMATION
  // ============================================
  const skillCards = document.querySelectorAll('.skill-card');

  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const ring = entry.target.querySelector('.progress-fill');
        if (ring) {
          const percent = parseInt(ring.getAttribute('data-percent'));
          const circumference = 2 * Math.PI * 36; // r=36
          const offset = circumference - (percent / 100) * circumference;
          // Small delay for visual effect
          setTimeout(() => {
            ring.style.strokeDashoffset = offset;
          }, 200);
        }
        skillObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  skillCards.forEach(card => skillObserver.observe(card));


  // ============================================
  // 7. PORTFOLIO FILTERING
  // ============================================
  const filterButtons = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active button
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      portfolioItems.forEach(item => {
        const category = item.getAttribute('data-category');

        if (filter === 'all' || category === filter) {
          item.style.display = '';
          item.style.opacity = '0';
          item.style.transform = 'scale(0.95)';
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
              item.style.opacity = '1';
              item.style.transform = 'scale(1)';
            });
          });
        } else {
          item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
          item.style.opacity = '0';
          item.style.transform = 'scale(0.95)';
          setTimeout(() => {
            item.style.display = 'none';
          }, 300);
        }
      });
    });
  });


  // ============================================
  // 8. PORTFOLIO MODAL / LIGHTBOX
  // ============================================
  const modal = document.getElementById('portfolioModal');
  const modalClose = document.getElementById('modalClose');
  const modalGallery = document.getElementById('modalGallery');

  portfolioItems.forEach(item => {
    item.addEventListener('click', () => {
      const imgSrc = item.querySelector('img').src;
      const previewAttr = item.getAttribute('data-preview');
      const previewImages = previewAttr
        ? previewAttr.split(',').map(src => src.trim()).filter(Boolean)
        : Array(3).fill(imgSrc);

      modalGallery.innerHTML = '';
      previewImages.forEach((src, index) => {
        const previewImage = document.createElement('img');
        previewImage.src = src;
        previewImage.alt = `${item.getAttribute('data-title')} preview ${index + 1}`;
        modalGallery.appendChild(previewImage);
      });

      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  modalClose.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });


  // ============================================
  // 9. CONTACT FORM HANDLING
  // ============================================
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');
  const formSubmitBtn = document.getElementById('formSubmitBtn');

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Simple validation
    const name = document.getElementById('formName').value.trim();
    const email = document.getElementById('formEmail').value.trim();
    const message = document.getElementById('formMessage').value.trim();

    if (!name || !email || !message) return;

    // Simulate sending
    formSubmitBtn.textContent = 'Sending...';
    formSubmitBtn.disabled = true;
    formSubmitBtn.style.opacity = '0.7';

    setTimeout(() => {
      contactForm.style.display = 'none';
      formSuccess.classList.add('show');
    }, 1500);
  });


  // ============================================
  // 10. SMOOTH SCROLL FOR ALL ANCHOR LINKS
  // ============================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });


  // ============================================
  // 11. FOOTER YEAR
  // ============================================
  document.getElementById('footerYear').textContent = new Date().getFullYear();


  // ============================================
  // 12. HERO PROFILE IMAGE FALLBACK
  // ============================================
  const heroImg = document.getElementById('heroProfileImage');
  if (heroImg) {
    heroImg.addEventListener('error', function() {
      // Create a visually appealing gradient placeholder
      this.style.display = 'none';
      this.parentElement.style.background = 'linear-gradient(135deg, #0f1115 0%, #00b8d4 50%, #08090b 100%)';
      this.parentElement.innerHTML = `
        <div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:8px;">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="rgba(0,240,255,0.5)" stroke-width="1"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          <span style="font-family:'Space Grotesk',sans-serif;color:rgba(0,240,255,0.6);font-size:0.8rem;letter-spacing:0.1em;">DESIGNER</span>
        </div>
      `;
    });
  }

  // ============================================
  // 13. HERO TYPING TEXT LOOP
  // ============================================
  const typingElement = document.querySelector('.typing-text');
  const typingPhrase = "I'Am Nafis Abdillah";
  const typeSpeed = 120;
  const deleteSpeed = 70;
  const pauseAfterTyping = 1800;
  const pauseAfterDeleting = 600;

  if (typingElement) {
    let index = 0;
    let isDeleting = false;

    const updateTyping = () => {
      const displayed = typingPhrase.slice(0, index);
      typingElement.textContent = displayed;

      if (!isDeleting && index < typingPhrase.length) {
        index += 1;
        setTimeout(updateTyping, typeSpeed);
      } else if (!isDeleting && index === typingPhrase.length) {
        isDeleting = true;
        setTimeout(updateTyping, pauseAfterTyping);
      } else if (isDeleting && index > 0) {
        index -= 1;
        setTimeout(updateTyping, deleteSpeed);
      } else {
        isDeleting = false;
        setTimeout(updateTyping, pauseAfterDeleting);
      }
    };

    setTimeout(updateTyping, 600);
  }

});
