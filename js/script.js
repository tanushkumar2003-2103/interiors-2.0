/**
 * ATELIER VAUCLUSE — LUXURY INTERIORS & ARCHITECTURE
 * Vanilla JavaScript Animation & Interaction System
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* ------------------------------------------------------------------------
     01. REFINED CUSTOM CURSOR (DESKTOP)
     ------------------------------------------------------------------------ */
  const cursorDot = document.getElementById('cursor-dot');
  const cursorFollower = document.getElementById('cursor-follower');
  const isTouchDevice = window.matchMedia('(hover: none) and (pointer: coarse)').matches;

  let mouseX = -100;
  let mouseY = -100;
  let followerX = -100;
  let followerY = -100;
  let isCursorVisible = false;

  if (!isTouchDevice && cursorDot && cursorFollower) {
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!isCursorVisible) {
        cursorDot.style.opacity = '1';
        cursorFollower.style.opacity = '1';
        isCursorVisible = true;
      }

      // Dot follows immediately
      cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
    });

    // Smooth follower with requestAnimationFrame lerp
    const renderCursor = () => {
      followerX += (mouseX - followerX) * 0.16;
      followerY += (mouseY - followerY) * 0.16;
      cursorFollower.style.transform = `translate3d(${followerX}px, ${followerY}px, 0) translate(-50%, -50%)`;
      requestAnimationFrame(renderCursor);
    };
    requestAnimationFrame(renderCursor);

    // Hide cursor when leaving document
    document.addEventListener('mouseleave', () => {
      cursorDot.style.opacity = '0';
      cursorFollower.style.opacity = '0';
      isCursorVisible = false;
    });

    // Project cards hover interaction (Expands cursor with 'VIEW')
    const projectItems = document.querySelectorAll('.project-item, .space-card');
    projectItems.forEach((item) => {
      item.addEventListener('mouseenter', () => {
        document.body.classList.add('cursor-hover-project');
        cursorFollower.textContent = 'VIEW';
      });
      item.addEventListener('mouseleave', () => {
        document.body.classList.remove('cursor-hover-project');
        cursorFollower.textContent = '';
      });
    });

    // Links & interactive elements hover interaction
    const interactiveElements = document.querySelectorAll('a, button, input, textarea, select');
    interactiveElements.forEach((el) => {
      el.addEventListener('mouseenter', () => {
        if (!document.body.classList.contains('cursor-hover-project')) {
          document.body.classList.add('cursor-hover-link');
        }
      });
      el.addEventListener('mouseleave', () => {
        document.body.classList.remove('cursor-hover-link');
      });
    });

    // Dark background detection for cursor contrast
    const darkSections = document.querySelectorAll('.hero, .section--dark, .statement-section, .footer, .immersive-living');
    const checkDarkSection = () => {
      let isOverDark = false;
      darkSections.forEach((sec) => {
        const rect = sec.getBoundingClientRect();
        if (mouseY >= rect.top && mouseY <= rect.bottom && mouseX >= rect.left && mouseX <= rect.right) {
          isOverDark = true;
        }
      });
      if (isOverDark) {
        document.body.classList.add('cursor-dark');
      } else {
        document.body.classList.remove('cursor-dark');
      }
    };
    window.addEventListener('scroll', checkDarkSection, { passive: true });
    document.addEventListener('mousemove', checkDarkSection);
  }

  /* ------------------------------------------------------------------------
     02. FLOATING NAVIGATION ON SCROLL
     ------------------------------------------------------------------------ */
  const siteHeader = document.getElementById('site-header');
  const scrollThreshold = 60;

  const handleNavScroll = () => {
    if (window.scrollY > scrollThreshold) {
      siteHeader.classList.add('is-scrolled');
    } else {
      siteHeader.classList.remove('is-scrolled');
    }
  };

  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll();

  /* ------------------------------------------------------------------------
     03. CINEMATIC HERO VIDEO & SCROLL PARALLAX
     ------------------------------------------------------------------------ */
  const heroVideo = document.getElementById('hero-video');
  const heroSection = document.getElementById('hero');
  const heroContent = document.querySelector('.hero__content');
  const heroScrollIndicator = document.querySelector('.hero__scroll-indicator');

  if (heroVideo) {
    // Attempt playback immediately with fallback handling
    heroVideo.play().catch(() => {
      // Autoplay with muted policy fallback
      heroVideo.muted = true;
      heroVideo.play().catch(() => {
        console.log('Video autoplay prevented or source pending');
      });
    });

    // Subtle scroll-driven scale and content fade
    window.addEventListener('scroll', () => {
      const scrollPos = window.scrollY;
      const heroHeight = heroSection.offsetHeight;

      if (scrollPos <= heroHeight) {
        const scrollFraction = scrollPos / heroHeight;
        
        // Very subtle scale from 1.02 to 1.10
        const scaleVal = 1.02 + scrollFraction * 0.08;
        heroVideo.style.transform = `scale(${scaleVal})`;

        // Fade hero content gracefully
        const opacityVal = Math.max(0, 1 - scrollFraction * 1.5);
        const translateYVal = scrollFraction * 50;
        
        if (heroContent) {
          heroContent.style.opacity = opacityVal.toString();
          heroContent.style.transform = `translate3d(0, -${translateYVal}px, 0)`;
        }
        if (heroScrollIndicator) {
          heroScrollIndicator.style.opacity = opacityVal.toString();
        }
      }
    }, { passive: true });
  }

  /* ------------------------------------------------------------------------
     04. MOBILE FULLSCREEN OVERLAY MENU
     ------------------------------------------------------------------------ */
  const menuTrigger = document.getElementById('menu-trigger');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileMenuLinks = document.querySelectorAll('.mobile-menu__link');

  const toggleMenu = () => {
    const isOpen = mobileMenu.classList.contains('is-active');
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  };

  const openMenu = () => {
    mobileMenu.classList.add('is-active');
    document.body.classList.add('menu-open');
    menuTrigger.setAttribute('aria-expanded', 'true');
    mobileMenu.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeMenu = () => {
    mobileMenu.classList.remove('is-active');
    document.body.classList.remove('menu-open');
    menuTrigger.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  if (menuTrigger && mobileMenu) {
    menuTrigger.addEventListener('click', toggleMenu);
    mobileMenuLinks.forEach((link) => {
      link.addEventListener('click', closeMenu);
    });
  }

  /* ------------------------------------------------------------------------
     05. INTERSECTION OBSERVER FOR EDITORIAL REVEALS
     ------------------------------------------------------------------------ */
  const revealElements = document.querySelectorAll('.reveal-fade-up');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach((el) => {
      revealObserver.observe(el);
    });
  } else {
    // Fallback for browsers without IntersectionObserver
    revealElements.forEach((el) => el.classList.add('is-revealed'));
  }

  /* ------------------------------------------------------------------------
     06. PROJECT & SPACE LIGHTBOX MODAL
     ------------------------------------------------------------------------ */
  const modal = document.getElementById('project-modal');
  const modalClose = document.getElementById('modal-close');
  const modalImg = document.getElementById('modal-img');
  const modalTitle = document.getElementById('modal-title');
  const modalEyebrow = document.getElementById('modal-eyebrow');
  const modalLoc = document.getElementById('modal-loc');
  const modalDesc = document.getElementById('modal-desc');

  const spaceDetails = {
    living: {
      title: 'Living Sanctuary',
      eyebrow: 'Space 01 — Architectural Core',
      loc: 'Open-Plan Living & Hearth',
      img: 'assets/images/living-room.jpg',
      desc: 'Form and light converge through floor-to-ceiling glass, framing natural courtyards. Honed Navona travertine complements continuous walnut wall panels and low-profile bespoke linen furniture.'
    },
    kitchen: {
      title: 'Culinary Pavilion',
      eyebrow: 'Space 02 — Sculptural Ritual',
      loc: 'Kitchen & Island Sanctuary',
      img: 'assets/images/kitchen.jpg',
      desc: 'Seamless architectural millwork concealing appliances behind bookmatched American walnut. A monolithic Calacatta marble island stands as the monumental centerpiece.'
    },
    bedroom: {
      title: 'Master Suite',
      eyebrow: 'Space 03 — Acoustic Stillness',
      loc: 'Private Rest & Horizon',
      img: 'assets/images/bedroom.jpg',
      desc: 'Vertical timber slats diffuse ambient room acoustics. Sheer architectural drapery filters afternoon sun, complemented by concealed 2700K warm LED channels and tactile Belgian linens.'
    },
    architecture: {
      title: 'Atrium & Corridor',
      eyebrow: 'Space 04 — Geometry & Light',
      loc: 'Monumental Entrance',
      img: 'assets/images/architecture.jpg',
      desc: 'A sunlit promenade defined by high-contrast shadow louvers, polished light cream flooring, and cantilevered walnut stairs ascending alongside honed limestone walls.'
    }
  };

  const openModal = (data) => {
    if (!modal) return;
    modalImg.src = data.img;
    modalImg.alt = data.title;
    modalTitle.textContent = data.title;
    modalEyebrow.textContent = data.eyebrow;
    modalLoc.textContent = data.loc;
    modalDesc.textContent = data.desc;

    modal.classList.add('is-active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    if (!modal) return;
    modal.classList.remove('is-active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  if (modal && modalClose) {
    modalClose.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('is-active')) {
        closeModal();
      }
    });

    const modalInquire = modal.querySelector('.modal-inquire-link');
    if (modalInquire) {
      modalInquire.addEventListener('click', closeModal);
    }
  }

  // Hook up project items
  const projectCards = document.querySelectorAll('.project-item');
  projectCards.forEach((card) => {
    card.addEventListener('click', () => {
      const data = {
        title: card.dataset.projectTitle,
        eyebrow: card.dataset.projectType,
        loc: card.dataset.projectLoc,
        img: card.dataset.projectImg,
        desc: card.dataset.projectDesc
      };
      openModal(data);
    });
  });

  // Hook up space cards
  const spaceCards = document.querySelectorAll('.space-card');
  spaceCards.forEach((card) => {
    card.addEventListener('click', () => {
      const spaceId = card.dataset.spaceId;
      if (spaceDetails[spaceId]) {
        openModal(spaceDetails[spaceId]);
      }
    });
  });

  /* ------------------------------------------------------------------------
     07. MINIMAL ARCHITECTURAL CONTACT FORM
     ------------------------------------------------------------------------ */
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');

  if (contactForm && formStatus) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('contact-name');
      const emailInput = document.getElementById('contact-email');
      const messageInput = document.getElementById('contact-message');

      if (!nameInput.value.trim() || !emailInput.value.trim() || !messageInput.value.trim()) {
        formStatus.textContent = 'Please complete all required fields.';
        formStatus.style.color = '#C58371';
        formStatus.style.display = 'block';
        return;
      }

      // Success State
      const submitBtn = contactForm.querySelector('.form-submit-btn');
      submitBtn.disabled = true;
      submitBtn.style.opacity = '0.5';

      formStatus.textContent = 'Inquiry received. An atelier partner in Zürich or Milano will be in touch within 24 hours.';
      formStatus.style.color = 'var(--color-accent)';
      formStatus.style.display = 'block';

      setTimeout(() => {
        contactForm.reset();
        submitBtn.disabled = false;
        submitBtn.style.opacity = '1';
      }, 3000);
    });
  }

  /* ------------------------------------------------------------------------
     08. AMBIENT ATMOSPHERE AUDIO TOGGLE
     ------------------------------------------------------------------------ */
  const audioToggle = document.getElementById('audio-toggle');
  const ambientAudio = document.getElementById('ambient-audio');

  if (audioToggle && ambientAudio) {
    let isPlaying = false;

    audioToggle.addEventListener('click', () => {
      if (!isPlaying) {
        ambientAudio.volume = 0.35;
        ambientAudio.play().then(() => {
          isPlaying = true;
          audioToggle.classList.add('is-playing');
          audioToggle.querySelector('.audio-label').textContent = 'Silence';
        }).catch((err) => {
          console.log('Audio playback prevented', err);
        });
      } else {
        ambientAudio.pause();
        isPlaying = false;
        audioToggle.classList.remove('is-playing');
        audioToggle.querySelector('.audio-label').textContent = 'Sound';
      }
    });
  }

  /* ------------------------------------------------------------------------
     09. SMOOTH ANCHOR LINK SCROLLING
     ------------------------------------------------------------------------ */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = targetEl.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
});
