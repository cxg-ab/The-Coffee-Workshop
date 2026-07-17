/**
 * The Coffee Workshop — Premium Motion Pack (GSAP + ScrollTrigger)
 * Hero 3D · scroll reveals · product stagger · page transitions · header scroll
 */
(function () {
  const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)');
  const TRANSITION_KEY = 'tcw-page-transition';
  const ORIGIN_STORY_ST_ID = 'origin-story-scroll';
  let heroMouseHandler = null;
  let lenis = null;
  let lenisTicker = null;

  function enabled() {
    if (REDUCED_MOTION.matches) return false;
    const flag = document.body.dataset.animations;
    if (flag === 'false' || flag === '0') return false;
    return typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined';
  }

  function isDesignMode() {
    return typeof Shopify !== 'undefined' && Shopify.designMode;
  }

  function initLenis() {
    if (!enabled() || isDesignMode() || typeof Lenis === 'undefined') return null;

    lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.15,
    });

    window._lenis = lenis;
    lenis.on('scroll', ScrollTrigger.update);

    lenisTicker = (time) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(lenisTicker);
    gsap.ticker.lagSmoothing(0);

    return lenis;
  }

  function destroyLenis() {
    if (lenisTicker) {
      gsap.ticker.remove(lenisTicker);
      lenisTicker = null;
    }
    if (lenis) {
      lenis.destroy();
      lenis = null;
      window._lenis = null;
    }
  }

  function resetMotionTargets() {
    if (typeof gsap === 'undefined') return;

    gsap.set(
      '[data-hero-visual], [data-hero-orb], [data-hero-copy] [data-hero-eyebrow], [data-hero-copy] [data-hero-heading], [data-hero-copy] [data-hero-sub], [data-hero-copy] [data-hero-cta] > *, [data-reveal], [data-reveal-item], .product-card, [data-footer-reveal]',
      { clearProps: 'opacity,visibility,transform' }
    );
  }

  function killAll() {
    if (heroMouseHandler) {
      const section = document.querySelector('[data-hero-section]');
      section?.removeEventListener('mousemove', heroMouseHandler);
      section?.removeEventListener('mouseleave', heroMouseHandler.leave);
      heroMouseHandler = null;
    }
    ScrollTrigger?.getAll().forEach((t) => t.kill());
    gsap?.globalTimeline.clear();
    destroyLenis();
    resetMotionTargets();
  }

  /* ─── Page transitions ─── */
  function initPageEnter() {
    const main = document.querySelector('#main-content');
    const overlay = document.querySelector('#page-transition');
    if (!main) return;

    const fromTransition = sessionStorage.getItem(TRANSITION_KEY) === '1';
    sessionStorage.removeItem(TRANSITION_KEY);

    if (fromTransition && overlay) {
      gsap.set(overlay, { autoAlpha: 1 });
      gsap.to(overlay, { autoAlpha: 0, duration: 0.5, ease: 'power2.inOut' });
    }

    gsap.from(main, {
      autoAlpha: 0,
      y: fromTransition ? 28 : 16,
      duration: 0.65,
      ease: 'power3.out',
      delay: fromTransition ? 0.08 : 0.05,
    });

    if (document.startViewTransition && fromTransition) {
      /* View Transitions API supported — GSAP handles fallback */
    }
  }

  function initPageExit() {
    document.addEventListener('click', (event) => {
      const link = event.target.closest('a[href]');
      if (!shouldPageTransition(event, link)) return;

      event.preventDefault();
      const href = link.href;
      const main = document.querySelector('#main-content');
      const overlay = document.querySelector('#page-transition');

      sessionStorage.setItem(TRANSITION_KEY, '1');

      const tl = gsap.timeline({
        onComplete: () => {
          window.location.href = href;
        },
      });

      if (main) tl.to(main, { autoAlpha: 0, y: -20, duration: 0.35, ease: 'power2.in' }, 0);
      if (overlay) tl.to(overlay, { autoAlpha: 1, duration: 0.35, ease: 'power2.in' }, 0);
    });
  }

  function shouldPageTransition(event, link) {
    if (!link || link.target === '_blank' || link.hasAttribute('download')) return false;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return false;
    if (link.closest('[data-cart-drawer]') || link.closest('form')) return false;

    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return false;
    if (href.includes('/checkout') || href.includes('account/logout')) return false;

    try {
      const url = new URL(link.href, window.location.origin);
      return url.origin === window.location.origin;
    } catch {
      return false;
    }
  }

  /* ─── Header shrink on scroll ─── */
  function initHeaderScroll() {
    const header = document.querySelector('[data-header]');
    if (!header) return;

    ScrollTrigger.create({
      start: 'top -60',
      onEnter: () => header.classList.add('is-scrolled'),
      onLeaveBack: () => header.classList.remove('is-scrolled'),
    });
  }

  /* ─── Hero entrance + 3D circle ─── */
  function initHeroEntrance() {
    const section = document.querySelector('[data-hero-section]');
    if (!section) return;

    const copy = section.querySelector('[data-hero-copy]');
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    const eyebrow = copy?.querySelector('[data-hero-eyebrow]');
    const tagline = copy?.querySelector('[data-hero-tagline]');
    const rule = copy?.querySelector('.hero-brand-rule');
    const headingLines = copy?.querySelectorAll('[data-hero-heading-line] .hero-heading__inner');
    const heading = copy?.querySelector('[data-hero-heading]');
    const sub = copy?.querySelector('[data-hero-sub]');
    const ctas = copy?.querySelectorAll('[data-hero-cta] > *');

    if (tagline) tl.from(tagline, { y: 20, autoAlpha: 0, duration: 0.6 });
    if (eyebrow) tl.from(eyebrow, { y: 28, autoAlpha: 0, duration: 0.7 }, tagline ? '-=0.35' : 0);
    if (rule) tl.from(rule, { scaleX: 0, transformOrigin: 'left center', duration: 0.55 }, '-=0.45');

    if (headingLines.length) {
      gsap.set(headingLines, { yPercent: 110 });
      tl.to(headingLines, { yPercent: 0, duration: 0.85, stagger: 0.1, ease: 'power3.out' }, '-=0.35');
    } else if (heading) {
      tl.from(heading, { y: 48, autoAlpha: 0, duration: 0.95 }, eyebrow || tagline ? '-=0.4' : 0);
    }

    if (sub) tl.from(sub, { y: 32, autoAlpha: 0, duration: 0.8 }, '-=0.55');
    if (ctas.length) tl.from(ctas, { y: 22, autoAlpha: 0, duration: 0.55, stagger: 0.12 }, '-=0.45');

    const visual = section.querySelector('[data-hero-visual]');
    const orbs = section.querySelectorAll('[data-hero-orb]');

    if (visual) {
      gsap.set(visual, { autoAlpha: 1, visibility: 'visible', opacity: 1 });
      tl.fromTo(
        visual,
        { scale: 0.88, opacity: 0, rotationY: -10 },
        { scale: 1, opacity: 1, rotationY: 0, duration: 1.1, ease: 'power2.out', immediateRender: false },
        '-=0.65'
      );
    }

    if (orbs.length) {
      gsap.set(orbs, { autoAlpha: 1, visibility: 'visible', opacity: 1 });
      tl.fromTo(
        orbs,
        { scale: 0.7, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.2, stagger: 0.15, ease: 'power2.out', immediateRender: false },
        '-=0.9'
      );

      gsap.to(orbs, {
        y: '+=20',
        x: '+=6',
        duration: 3.8,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        stagger: { each: 0.45, from: 'random' },
      });
    }
  }

  function initHero3DMouse() {
    const section = document.querySelector('[data-hero-section]');
    const stage = section?.querySelector('[data-hero-3d]');
    const visual = section?.querySelector('[data-hero-visual]');
    const orbs = section?.querySelectorAll('[data-hero-orb]');
    if (!section || !stage || !visual) return;

    if (window.matchMedia('(max-width: 767px)').matches) return;

    const reset = () => {
      gsap.to(visual, { rotateX: 0, rotateY: 0, x: 0, y: 0, duration: 0.8, ease: 'power2.out' });
      gsap.to(orbs, { x: 0, y: 0, duration: 0.8, ease: 'power2.out' });
    };

    heroMouseHandler = (event) => {
      const rect = stage.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width - 0.5;
      const py = (event.clientY - rect.top) / rect.height - 0.5;

      gsap.to(visual, {
        rotateY: px * 18,
        rotateX: -py * 14,
        x: px * 14,
        y: py * 10,
        duration: 0.6,
        ease: 'power2.out',
        overwrite: true,
      });

      gsap.to(orbs, {
        x: px * -28,
        y: py * -18,
        duration: 0.75,
        ease: 'power2.out',
        overwrite: true,
        stagger: 0.04,
      });
    };

    heroMouseHandler.leave = reset;
    section.addEventListener('mousemove', heroMouseHandler);
    section.addEventListener('mouseleave', reset);
  }

  function initHeroParallax() {
    const section = document.querySelector('[data-hero-section]');
    if (!section) return;

    const isMobile = window.matchMedia('(max-width: 767px)').matches;

    gsap.to(section.querySelector('[data-hero-visual]'), {
      y: isMobile ? -24 : -48,
      rotationY: isMobile ? 2 : 4,
      ease: 'none',
      scrollTrigger: { trigger: section, start: 'top top', end: 'bottom top', scrub: true },
    });

    gsap.to(section.querySelectorAll('[data-hero-orb]'), {
      y: isMobile ? -36 : -72,
      scale: 1.06,
      ease: 'none',
      scrollTrigger: { trigger: section, start: 'top top', end: 'bottom top', scrub: true },
    });

    gsap.to(section.querySelector('[data-hero-copy]'), {
      y: isMobile ? 12 : 24,
      ease: 'none',
      scrollTrigger: { trigger: section, start: 'top top', end: 'bottom top', scrub: true },
    });
  }

  function initHeroClipReveal() {
    return; // Disabled per user request
    const section = document.querySelector('[data-hero-section]');
    const clip = section?.querySelector('[data-hero-clip]');
    if (!section || !clip) return;

    const isMobile = window.matchMedia('(max-width: 767px)').matches;

    gsap.set(clip, {
      clipPath: 'inset(0% 0% 0% 0%)',
      webkitClipPath: 'inset(0% 0% 0% 0%)',
    });

    gsap.to(clip, {
      clipPath: 'inset(100% 0% 0% 0%)',
      webkitClipPath: 'inset(100% 0% 0% 0%)',
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: isMobile ? '+=90%' : '+=130%',
        scrub: true,
        invalidateOnRefresh: true,
      },
    });

    gsap.to(section.querySelector('[data-hero-copy]'), {
      autoAlpha: 0.35,
      y: isMobile ? 28 : 48,
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: isMobile ? '+=70%' : '+=100%',
        scrub: true,
      },
    });

    gsap.to(section.querySelector('[data-hero-visual]'), {
      scale: 0.88,
      autoAlpha: 0.5,
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: isMobile ? '+=70%' : '+=100%',
        scrub: true,
      },
    });
  }

  /* ─── Scroll reveals ─── */
  function initScrollReveals() {
    gsap.utils.toArray('[data-reveal]').forEach((el) => {
      if (el.closest('[data-hero-section]') || el.closest('[data-about-section]')) return;

      const y = parseFloat(el.dataset.revealY || 56);
      const scale = parseFloat(el.dataset.revealScale || 0.96);
      const delay = parseFloat(el.dataset.revealDelay || 0);

      gsap.from(el, {
        y,
        scale,
        autoAlpha: 0,
        duration: 1,
        delay,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 90%',
          toggleActions: 'play none none none',
          once: true,
        },
      });
    });
  }

  function initRevealGroups() {
    gsap.utils.toArray('[data-reveal-group]').forEach((group) => {
      if (group.closest('[data-about-section]')) return;
      const children = group.querySelectorAll('[data-reveal-item]');
      if (!children.length) return;

      gsap.set(children, { y: 48, autoAlpha: 0, scale: 0.94 });

      ScrollTrigger.batch(children, {
        trigger: group,
        start: 'top 88%',
        once: true,
        onEnter: (batch) => {
          gsap.to(batch, {
            y: 0,
            autoAlpha: 1,
            scale: 1,
            duration: 0.85,
            ease: 'power3.out',
            stagger: 0.12,
            overwrite: true,
          });
        },
      });
    });
  }

  /* ─── About us section ─── */
  function initAboutStory() {
    const section = document.querySelector('[data-about-section]');
    if (!section) return;

    const introItems = section.querySelectorAll('[data-about-intro] [data-about-item]');
    const bodyItems = section.querySelectorAll('[data-about-body] [data-about-item]');
    const cards = section.querySelectorAll('[data-about-card]');
    const glow = section.querySelector('[data-about-glow]');

    if (glow) {
      gsap.fromTo(
        glow,
        { autoAlpha: 0, scale: 0.85 },
        {
          autoAlpha: 1,
          scale: 1,
          duration: 1.2,
          ease: 'power2.out',
          scrollTrigger: { trigger: section, start: 'top 92%', once: true },
        }
      );

      gsap.to(glow, {
        y: -36,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.8,
        },
      });
    }

    if (introItems.length) {
      gsap.set(introItems, { y: 44, autoAlpha: 0 });

      ScrollTrigger.create({
        trigger: section.querySelector('[data-about-intro]'),
        start: 'top 86%',
        once: true,
        onEnter: () => {
          gsap.to(introItems, {
            y: 0,
            autoAlpha: 1,
            duration: 0.9,
            stagger: 0.13,
            ease: 'power3.out',
            overwrite: true,
          });
        },
      });
    }

    if (bodyItems.length) {
      gsap.set(bodyItems, { y: 36, autoAlpha: 0 });

      ScrollTrigger.create({
        trigger: section.querySelector('[data-about-body]'),
        start: 'top 88%',
        once: true,
        onEnter: () => {
          gsap.to(bodyItems, {
            y: 0,
            autoAlpha: 1,
            duration: 0.85,
            stagger: 0.15,
            ease: 'power3.out',
            overwrite: true,
          });
        },
      });
    }

    if (cards.length) {
      gsap.set(cards, { y: 56, autoAlpha: 0, scale: 0.96 });

      ScrollTrigger.batch(cards, {
        trigger: section.querySelector('[data-about-values]') || section,
        start: 'top 90%',
        once: true,
        onEnter: (batch) => {
          gsap.to(batch, {
            y: 0,
            autoAlpha: 1,
            scale: 1,
            duration: 0.85,
            ease: 'power3.out',
            stagger: { each: 0.12, from: 'start' },
            overwrite: true,
            onComplete: () => {
              batch.forEach((card) => card.classList.add('is-visible'));
            },
          });
        },
      });
    }
  }

  /* ─── Origin sticky scroll (CSS handled) ─── */
  function initOriginHorizontalScroll() {
    // Left intentionally blank as layout is handled gracefully via CSS position: sticky
  }

  /* ─── Origins kinetic marquee ─── */
  function initOriginsKineticMarquee() {
    const section = document.querySelector('[data-origins-kinetic]');
    if (!section || !enabled()) return;

    const trackA = section.querySelector('[data-origins-track-a]');
    const trackB = section.querySelector('[data-origins-track-b]');
    if (!trackA) return;

    gsap.from(section, {
      autoAlpha: 0,
      y: 40,
      duration: 1,
      ease: 'power2.out',
      scrollTrigger: { trigger: section, start: 'top 92%', once: true },
    });

    gsap.to(trackA, {
      xPercent: -8,
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    });

    if (trackB) {
      gsap.to(trackB, {
        xPercent: 8,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });
    }
  }

  /* ─── Product cards ─── */
  function initProductCards() {
    const cards = document.querySelectorAll('.product-card');
    if (!cards.length) return;

    gsap.set(cards, { y: 60, autoAlpha: 0, scale: 0.92, rotationX: 6, transformPerspective: 800 });

    ScrollTrigger.batch(cards, {
      start: 'top 92%',
      once: true,
      onEnter: (batch) => {
        gsap.to(batch, {
          y: 0,
          autoAlpha: 1,
          scale: 1,
          rotationX: 0,
          duration: 0.9,
          ease: 'power3.out',
          stagger: { each: 0.1, from: 'start' },
          overwrite: true,
        });
      },
    });
  }

  /* ─── Footer + marquee + FAQ ─── */
  function initFooterReveal() {
    const footer = document.querySelector('[data-footer-reveal]');
    if (!footer) return;

    gsap.from(footer, {
      y: 40,
      autoAlpha: 0,
      duration: 1,
      ease: 'power2.out',
      scrollTrigger: { trigger: footer, start: 'top bottom', once: true },
    });
  }

  function initMarqueeEnhancement() {
    initOriginsKineticMarquee();
  }

  function initFaqAccordion() {
    document.querySelectorAll('.faq-section details').forEach((detail) => {
      const content = detail.querySelector('.faq-answer');
      if (!content) return;

      detail.addEventListener('toggle', () => {
        if (detail.open) {
          gsap.fromTo(content, { height: 0, autoAlpha: 0 }, { height: 'auto', autoAlpha: 1, duration: 0.45, ease: 'power2.out' });
        }
      });
    });
  }

  /* ─── Button micro-interactions ─── */
  function initButtonMotion() {
    document.querySelectorAll('.btn-primary, .btn-outline').forEach((btn) => {
      btn.addEventListener('mouseenter', () => {
        gsap.to(btn, { scale: 1.03, duration: 0.3, ease: 'power2.out' });
      });
      btn.addEventListener('mouseleave', () => {
        gsap.to(btn, { scale: 1, duration: 0.3, ease: 'power2.out' });
      });
    });
  }

  /* ─── Parallax sections ─── */
  function initParallaxSections() {
    gsap.utils.toArray('[data-parallax]').forEach((el) => {
      const speed = parseFloat(el.dataset.parallax || 0.3);
      gsap.to(el, {
        y: () => -80 * speed,
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });
    });
  }

  function initAnimations() {
    if (!enabled()) return;

    gsap.registerPlugin(ScrollTrigger);

    initPageEnter();
    initPageExit();
    initHeaderScroll();
    initHeroEntrance();
    initHero3DMouse();
    initHeroParallax();
    initHeroClipReveal();
    initScrollReveals();
    initRevealGroups();
    initAboutStory();
    initProductCards();
    initFooterReveal();
    initMarqueeEnhancement();
    initFaqAccordion();
    initButtonMotion();
    initParallaxSections();

    const visual = document.querySelector('[data-hero-visual]');
    const orbs = document.querySelectorAll('[data-hero-orb]');
    if (visual) gsap.set(visual, { autoAlpha: 1, opacity: 1, visibility: 'visible' });
    if (orbs.length) gsap.set(orbs, { autoAlpha: 1, opacity: 1, visibility: 'visible' });

    document.body.classList.add('animations-ready');
    ScrollTrigger.refresh();
  }

  function onReady() {
    killAll();

    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      window.setTimeout(onReady, 50);
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    initLenis();
    initOriginHorizontalScroll();

    if (!enabled()) return;

    initAnimations();
    ScrollTrigger.refresh();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', onReady);
  } else {
    onReady();
  }

  document.addEventListener('shopify:section:load', () => {
    requestAnimationFrame(onReady);
  });

  window.addEventListener('resize', () => ScrollTrigger?.refresh());
  REDUCED_MOTION.addEventListener('change', onReady);
})();
