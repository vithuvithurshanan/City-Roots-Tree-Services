// ============================================================
// City Roots Tree Services — Main JavaScript
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

  // -------------------------
  // 1. Dynamic Copyright Year
  // -------------------------
  const yearEl = document.getElementById('copyright-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // -------------------------
  // 2. Sticky Header on Scroll
  // -------------------------
  const header = document.getElementById('main-header');
  if (header) {
    let ticking = false;
    const onScroll = () => {
      const currentScroll = window.scrollY;
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (currentScroll > 30) {
            header.classList.add('scrolled');
          } else {
            header.classList.remove('scrolled');
          }
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    requestAnimationFrame(onScroll);
  }

  // -------------------------
  // 3. Mobile Menu Toggle
  // -------------------------
  const menuToggle = document.getElementById('menu-toggle-btn');
  const mainNav = document.getElementById('main-nav');

  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', () => {
      const isOpen = mainNav.classList.toggle('active');
      menuToggle.setAttribute('aria-expanded', isOpen.toString());
      // Animate hamburger into X
      menuToggle.classList.toggle('open', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close menu when a nav link is clicked
    mainNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('active');
        menuToggle.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    // Close menu if user clicks outside
    document.addEventListener('click', (e) => {
      if (
        mainNav.classList.contains('active') &&
        !mainNav.contains(e.target) &&
        !menuToggle.contains(e.target)
      ) {
        mainNav.classList.remove('active');
        menuToggle.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }

  // -------------------------
  // 4. Hamburger → X Animation
  // -------------------------
  const styleTag = document.createElement('style');
  styleTag.textContent = `
    .menu-toggle.open span:nth-child(1) {
      transform: translateY(8px) rotate(45deg);
    }
    .menu-toggle.open span:nth-child(2) {
      opacity: 0;
      transform: scaleX(0);
    }
    .menu-toggle.open span:nth-child(3) {
      transform: translateY(-8px) rotate(-45deg);
    }
  `;
  document.head.appendChild(styleTag);

  // -------------------------
  // 5. Active Nav Link on Scroll
  // -------------------------
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('nav .nav-link');

  if (sections.length && navLinks.length) {
    const observerOptions = {
      root: null,
      rootMargin: '-40% 0px -55% 0px',
      threshold: 0,
    };

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${entry.target.id}`) {
              link.classList.add('active');
            }
          });
        }
      });
    }, observerOptions);

    sections.forEach(section => sectionObserver.observe(section));
  }

  // -------------------------
  // 6. FAQ Accordion
  // -------------------------
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    const content = item.querySelector('.faq-content');
    const contentInner = item.querySelector('.faq-content-inner');

    if (!trigger || !content) return;

    trigger.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      // Read the layout dimension before any writes below, so the browser
      // doesn't have to force a synchronous reflow to answer it.
      const openHeight = contentInner ? contentInner.scrollHeight + 'px' : '300px';

      // Close all other items
      faqItems.forEach(otherItem => {
        if (otherItem !== item && otherItem.classList.contains('active')) {
          otherItem.classList.remove('active');
          const otherContent = otherItem.querySelector('.faq-content');
          const otherTrigger = otherItem.querySelector('.faq-trigger');
          if (otherContent) otherContent.style.maxHeight = '0';
          if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
        }
      });

      // Toggle current item
      if (isActive) {
        item.classList.remove('active');
        content.style.maxHeight = '0';
        trigger.setAttribute('aria-expanded', 'false');
      } else {
        item.classList.add('active');
        content.style.maxHeight = openHeight;
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
  });

   // -------------------------
  // 7. Scroll-In Animations (Fade + Slide Up)
  // -------------------------
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const animatableElements = document.querySelectorAll(
    ".service-card, .process-card, .badge-item, .comparison-card, .faq-item, .cta-box, .section-header"
  );

  if ("IntersectionObserver" in window && !prefersReducedMotion) {
    const animStyle = document.createElement("style");

    animStyle.textContent = `
      .anim-target {
        opacity: 0;
        transform: translateY(28px);
        transition:
          opacity 0.55s cubic-bezier(0.4, 0, 0.2, 1),
          transform 0.55s cubic-bezier(0.4, 0, 0.2, 1);
      }

      .anim-target.anim-visible {
        opacity: 1;
        transform: translateY(0);
      }
    `;

    document.head.appendChild(animStyle);

    const animObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const delay = Number(entry.target.dataset.animDelay || 0);

            setTimeout(() => {
              entry.target.classList.add("anim-visible");
            }, delay);

            animObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    const grids = document.querySelectorAll(
      ".services-grid, .process-steps, .badges-grid, .comparison-grid"
    );

    grids.forEach((grid) => {
      Array.from(grid.children).forEach((child, index) => {
        child.dataset.animDelay = index * 100;
      });
    });

    animatableElements.forEach((element) => {
      element.classList.add("anim-target");
      animObserver.observe(element);
    });
  } else {
    animatableElements.forEach((element) => {
      element.style.opacity = "1";
      element.style.transform = "none";
    });
  }

  

  // -------------------------
  // 8. Smooth CTA Phone Link Hover Effect
  // -------------------------
  const ctaPhoneTag = document.querySelector('.cta-phone-tag');
  if (ctaPhoneTag) {
    ctaPhoneTag.addEventListener('mouseenter', () => {
      ctaPhoneTag.style.transform = 'scale(1.04)';
    });
    ctaPhoneTag.addEventListener('mouseleave', () => {
      ctaPhoneTag.style.transform = 'scale(1)';
    });
    ctaPhoneTag.style.transition = 'transform 0.2s cubic-bezier(0.4,0,0.2,1)';
    ctaPhoneTag.style.display = 'inline-flex';
  }

});
const loadButton = document.getElementById("load-ghl-form");
const formWrapper = document.getElementById("ghl-form-wrapper");

if (loadButton && formWrapper) {
  loadButton.addEventListener("click", () => {
    if (formWrapper.dataset.loaded === "true") return;

    formWrapper.dataset.loaded = "true";

    formWrapper.innerHTML = `
      <iframe
        src="https://link.kdlead.com/widget/form/PbCA0dHMxP85aKhIO3ew"
        style="width:100%;height:794px;border:none;border-radius:8px;"
        id="inline-PbCA0dHMxP85aKhIO3ew"
        data-layout='{"id":"INLINE"}'
        data-trigger-type="alwaysShow"
        data-activation-type="alwaysActivated"
        data-deactivation-type="neverDeactivate"
        data-form-id="PbCA0dHMxP85aKhIO3ew"
      ></iframe>
    `;

    const script = document.createElement("script");
    script.src = "https://link.kdlead.com/js/form_embed.js?v=2";
    script.async = true;

    document.body.appendChild(script);
  });
}
