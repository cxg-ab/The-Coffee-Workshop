/**
 * The Coffee Workshop — Premium Motion Pack (GSAP + ScrollTrigger)
 * Hero 3D · split-text titles · scroll reveals · origin story choreography
 * product stagger · page transitions · header scroll
 */
(function () {
  const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)');
  const TRANSITION_KEY = 'tcw-page-transition';
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

  /* ─── Split-text (word masks — safe for Arabic ligatures, RTL aware) ─── */
  const SPLIT_STYLE_ID = 'tcw-split-style';

  function injectSplitStyle() {
    if (document.getElementById(SPLIT_STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = SPLIT_STYLE_ID;
    style.textContent = [
      '.tcw-word{display:inline-block;overflow:hidden;vertical-align:bottom;padding-bottom:0.08em;margin-bottom:-0.08em;}',
      '.tcw-word__inner{display:inline-block;will-change:transform;}',
    ].join('');
    document.head.appendChild(style);
  }

  function wrapWord(node) {
    const outer = document.createElement('span');
    outer.className = 'tcw-word';
    const inner = document.createElement('span');
    inner.className = 'tcw-word__inner';
    inner.appendChild(node);
    outer.appendChild(inner);
    return outer;
  }

  /**
   * Splits an element's direct text into word masks. Nested elements
   * (e.g. styled Arabic spans) are wrapped whole, preserving their markup.
   * Returns the array of .tcw-word__inner spans (empty if already split).
   */
  function splitWords(el) {
    if (!el || el.dataset.tcwSplit === '1') {
      return el ? Array.from(el.querySelectorAll('.tcw-word__inner')) : [];
    }

    el.dataset.tcwSplitOriginal = el.innerHTML;
    const nodes = Array.from(el.childNodes);
    const frag = document.createDocumentFragment();

    nodes.forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const parts = node.textContent.split(/(\s+)/);
        parts.forEach((part) => {
          if (!part) return;
          if (/^\s+$/.test(part)) {
            frag.appendChild(document.createTextNode(' '));
          } else {
            frag.appendChild(wrapWord(document.createTextNode(part)));
          }
        });
      } else if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'BR') {
        frag.appendChild(node);
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        frag.appendChild(wrapWord(node));
      }
    });

    el.innerHTML = '';
    el.appendChild(frag);
    el.dataset.tcwSplit = '1';
    return Array.from(el.querySelectorAll('.tcw-word__inner'));
  }

  function revertSplits() {
    document.querySelectorAll('[data-tcw-split="1"]').forEach((el) => {
      el.innerHTML = el.dataset.tcwSplitOriginal || el.innerHTML;
      delete el.dataset.tcwSplit;
      delete el.dataset.tcwSplitOriginal;
    });
  }

  function initLenis() {
    if (!enabled() || isDesignMode() || typeof Lenis === 'undefined') return null;

    /* Touch devices (iPad, phones) get native momentum scrolling. Lenis
       intercepts touch scroll and makes it feel heavy/laggy on mobile, so
       smooth-scroll is desktop (fine-pointer) only. ScrollTrigger animations
       still work — they just read native scroll instead of Lenis. */
    if (window.matchMedia('(pointer: coarse)').matches) return null;

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
      '[data-hero-visual], [data-hero-orb], [data-hero-copy] [data-hero-eyebrow], [data-hero-copy] [data-hero-heading], [data-hero-copy] [data-hero-sub], [data-hero-copy] [data-hero-cta] > *, [data-reveal], [data-reveal-item], .product-card, [data-footer-reveal], [data-origin-media], [data-origin-media] img, [data-origin-copy] > *',
      { clearProps: 'opacity,visibility,transform,clipPath' }
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
    revertSplits();
    resetMotionTargets();
  }

  /* ─── Page transitions (GSAP overlay — complete implementation) ─── */
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

    /* bfcache: restore visibility when navigating back to a page whose
       exit animation left #main-content hidden. */
    window.addEventListener('pageshow', (event) => {
      if (!event.persisted) return;
      const main = document.querySelector('#main-content');
      const overlay = document.querySelector('#page-transition');
      if (main && typeof gsap !== 'undefined') gsap.set(main, { clearProps: 'opacity,visibility,transform' });
      if (overlay && typeof gsap !== 'undefined') gsap.set(overlay, { autoAlpha: 0 });
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

    /* The hero copy is pre-hidden in CSS to avoid a flash (buttons/heading
       briefly showing before the .from() tweens hide them). Reveal it at t=0 —
       by then the .from tweens below have already set the children to their
       hidden start state, so it animates in cleanly with no flash. */
    if (copy) tl.set(copy, { visibility: 'visible' }, 0);

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

    /* SplitText-style word masks per heading line (falls back to line masks) */
    let heroWords = [];
    headingLines.forEach((line) => {
      heroWords = heroWords.concat(splitWords(line));
    });

    if (heroWords.length) {
      gsap.set(headingLines, { yPercent: 0 });
      gsap.set(heroWords, { yPercent: 115 });
      tl.to(
        heroWords,
        { yPercent: 0, duration: 0.9, stagger: 0.07, ease: 'power4.out' },
        '-=0.35'
      );
    } else if (headingLines.length) {
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

  /* ─── Split-text titles (any section) ─── */
  function initSplitTitles() {
    gsap.utils.toArray('[data-split-title]').forEach((el) => {
      if (el.closest('[data-hero-section]')) return;

      const words = splitWords(el);
      if (!words.length) return;

      gsap.set(words, { yPercent: 115 });

      gsap.to(words, {
        yPercent: 0,
        duration: 0.9,
        stagger: 0.055,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          once: true,
        },
      });
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

  /* ─── About / Visit glass story ─── */
  function initGlassStorySection(section) {
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

  function initAboutStory() {
    document.querySelectorAll('[data-about-section], [data-visit-section]').forEach(initGlassStorySection);
  }

  /* ─── Origin story — sticky intro + card choreography ─── */
  function initOriginStory() {
    const section = document.querySelector('[data-origin-sticky-section]');
    if (!section) return;

    const cards = section.querySelectorAll('[data-origin-card]');
    const progressCurrent = section.querySelector('[data-origin-progress-current]');
    const padIndex = (n) => String(n).padStart(2, '0');
    const isMobile = window.matchMedia('(max-width: 1023px)').matches;

    if (progressCurrent && cards.length) {
      const updateProgress = (index) => {
        progressCurrent.textContent = padIndex(Math.min(Math.max(index, 1), cards.length));
      };

      updateProgress(1);

      cards.forEach((card, i) => {
        ScrollTrigger.create({
          trigger: card,
          start: 'top 55%',
          end: 'bottom 45%',
          onEnter: () => updateProgress(i + 1),
          onEnterBack: () => updateProgress(i + 1),
        });
      });
    }

    cards.forEach((card) => {
      const media = card.querySelector('[data-origin-media]');
      const img = media?.querySelector('img');
      const copyItems = card.querySelectorAll('[data-origin-copy] > *:not([data-split-title])');

      /* Scale + opacity reveal — avoids clip-path repaints during scroll */
      if (media) {
        gsap.fromTo(
          media,
          { scale: 0.96, autoAlpha: 0.35 },
          {
            scale: 1,
            autoAlpha: 1,
            duration: 1.1,
            ease: 'power3.out',
            force3D: true,
            scrollTrigger: { trigger: card, start: 'top 82%', once: true },
          }
        );
      }

      /* Inner-image parallax — desktop only; scrub on every card is the main mobile jank source */
      if (img && !isMobile) {
        gsap.set(img, { force3D: true });
        gsap.fromTo(
          img,
          { scale: 1.08, y: -12 },
          {
            scale: 1.08,
            y: 12,
            ease: 'none',
            force3D: true,
            scrollTrigger: {
              trigger: card,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1,
            },
          }
        );
      }

      /* Copy stagger */
      if (copyItems.length) {
        gsap.set(copyItems, { y: 30, autoAlpha: 0 });
        ScrollTrigger.create({
          trigger: card,
          start: 'top 74%',
          once: true,
          onEnter: () => {
            gsap.to(copyItems, {
              y: 0,
              autoAlpha: 1,
              duration: 0.8,
              stagger: 0.1,
              ease: 'power3.out',
              overwrite: true,
            });
          },
        });
      }
    });
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

  /* ─── Product page — pinned gallery drift ─── */
  function initProductGallery() {
    const gallery = document.querySelector('[data-product-gallery]');
    if (!gallery) return;
    if (window.matchMedia('(max-width: 1023px)').matches) return;

    const img = gallery.querySelector('img');
    if (!img) return;

    /* Gallery column is CSS-sticky (pinned); give the packshot a gentle
       counter-drift so the pin feels alive while specs scroll past. */
    gsap.fromTo(
      img,
      { y: 18 },
      {
        y: -18,
        ease: 'none',
        scrollTrigger: {
          trigger: gallery.closest('.site-container') || gallery,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.5,
        },
      }
    );
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
    injectSplitStyle();

    initPageEnter();
    initPageExit();
    initHeaderScroll();
    initHeroEntrance();
    initHero3DMouse();
    initHeroParallax();
    initSplitTitles();
    initScrollReveals();
    initRevealGroups();
    initAboutStory();
    initOriginStory();
    initProductCards();
    initProductGallery();
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

    if (!enabled()) return;

    initAnimations();
    ScrollTrigger.refresh();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', onReady);
  } else {
    onReady();
  }

  /* Failsafe: the hero copy is pre-hidden in CSS to avoid an entrance-flash.
     If the entrance animation never runs (e.g. GSAP fails to load), reveal it
     anyway so it can't get stuck invisible. */
  window.setTimeout(function () {
    if (!document.body.classList.contains('animations-ready')) {
      document.querySelectorAll('[data-hero-copy]').forEach(function (el) {
        el.style.visibility = 'visible';
      });
    }
  }, 1200);

  document.addEventListener('shopify:section:load', () => {
    requestAnimationFrame(onReady);
  });

  /* Debounced resize handler: on mobile, the address bar hiding/showing
     while scrolling fires 'resize' repeatedly. Refreshing every ScrollTrigger
     position on every one of those events causes visible jank mid-scroll.
     Only refresh once resize activity has actually settled. */
  let resizeRefreshTimer = null;
  window.addEventListener('resize', () => {
    if (resizeRefreshTimer) clearTimeout(resizeRefreshTimer);
    resizeRefreshTimer = window.setTimeout(() => {
      ScrollTrigger?.refresh();
    }, 200);
  });

  REDUCED_MOTION.addEventListener('change', onReady);
})();
