/**
 * The Coffee Workshop — Premium Motion Pack (GSAP + ScrollTrigger)
 * Hero 3D · split-text titles · scroll reveals · origin story choreography
 * product stagger · page transitions · header scroll
 */
(function () {
  const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)');
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
      '[data-hero-visual], [data-hero-copy] [data-hero-eyebrow], [data-hero-copy] [data-hero-heading], [data-hero-stagger], [data-hero-sweep], [data-reveal], .product-card, [data-footer-reveal], [data-origin-media], [data-origin-media] img, [data-origin-copy] > *',
      { clearProps: 'opacity,visibility,transform,clipPath,filter' }
    );
    document
      .querySelectorAll('.reveal-native')
      .forEach((el) => el.classList.remove('reveal-native'));
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

  /* ─── Page enter ───
     There is deliberately no exit animation. The previous implementation
     intercepted every same-origin click, called preventDefault(), played a
     350ms fade, and only set window.location.href in the timeline's
     onComplete — so the browser was not told where to go until the animation
     finished. That put 350ms of dead time in front of the highest-frequency
     action on a store (every product card, every nav item), with no network
     work happening during it. Worse, the "overlay" it faded in had no CSS
     beyond `visibility: visible` — no position, size or background — so the
     only thing the visitor actually saw was the page content vanishing while
     they waited. Navigation is now native and instant; the arrival is
     animated instead, which costs nothing. */
  function initPageEnter() {
    const main = document.querySelector('#main-content');
    if (!main) return;

    gsap.from(main, {
      autoAlpha: 0,
      y: 16,
      duration: 0.65,
      ease: 'power3.out',
      delay: 0.05,
    });
  }

  /* bfcache: a restored page keeps whatever inline styles the enter tween
     left behind, so clear them on the way back in. */
  function initBfcacheRestore() {
    window.addEventListener('pageshow', (event) => {
      if (!event.persisted) return;
      const main = document.querySelector('#main-content');
      if (main && typeof gsap !== 'undefined') gsap.set(main, { clearProps: 'opacity,visibility,transform' });
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

    /* ─── Cinematic Bold additions ───
       Appended with ABSOLUTE positions so they don't perturb the relative
       (-=) chain that builds the eyebrow → heading → visual sequence above. */

    /* Heading "materializes": soft-blur resolves to sharp while the word masks
       rise. Runs only when word masks exist (skips the plain fallback). */
    if (heading && heroWords.length) {
      tl.fromTo(
        heading,
        { filter: 'blur(12px)' },
        { filter: 'blur(0px)', duration: 0.9, ease: 'power2.out' },
        0.35
      );
    }

    /* Cascade the secondary copy (subheading · CTA · badges) into the entrance
       rhythm instead of popping in with the copy container. */
    const staggerItems = copy?.querySelectorAll('[data-hero-stagger]');
    if (staggerItems && staggerItems.length) {
      tl.from(
        staggerItems,
        { y: 26, autoAlpha: 0, duration: 0.7, stagger: 0.12, ease: 'power3.out' },
        0.7
      );
    }

    /* Signature moment — ONE bronze light sweep across the hero on entrance.
       Never loops (anti-slop): it fires once as part of the entrance timeline. */
    const sweep = section.querySelector('[data-hero-sweep]');
    if (sweep) {
      tl.fromTo(
        sweep,
        { xPercent: -120, opacity: 0 },
        { xPercent: 120, opacity: 0.9, duration: 1.0, ease: 'power2.inOut' },
        0.15
      );
      tl.to(sweep, { opacity: 0, duration: 0.35, ease: 'power1.out' }, 1.05);
    }
  }

  /* ─── Magnetic CTA (fine-pointer only) ─── */
  function initHeroMagnetic() {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    document.querySelectorAll('[data-magnetic]').forEach((el) => {
      if (el.dataset.magneticBound === '1') return;
      el.dataset.magneticBound = '1';

      const strength = parseFloat(el.dataset.magnetic) || 0.35;

      /* quickTo builds the tween once and retargets its value on each call.
         The previous gsap.to(..., overwrite: true) per pointer event forced
         GSAP to scan and kill existing tweens before constructing a new one,
         every single move. */
      const xTo = gsap.quickTo(el, 'x', { duration: 0.4, ease: 'power2.out' });
      const yTo = gsap.quickTo(el, 'y', { duration: 0.4, ease: 'power2.out' });

      const onMove = (event) => {
        const r = el.getBoundingClientRect();
        xTo((event.clientX - (r.left + r.width / 2)) * strength);
        yTo((event.clientY - (r.top + r.height / 2)) * strength);
      };
      const onLeave = () => {
        xTo(0);
        yTo(0);
      };

      el.addEventListener('mousemove', onMove);
      el.addEventListener('mouseleave', onLeave);
    });
  }

  function initHero3DMouse() {
    const section = document.querySelector('[data-hero-section]');
    const stage = section?.querySelector('[data-hero-3d]');
    const visual = section?.querySelector('[data-hero-visual]');
    const orbs = section?.querySelectorAll('[data-hero-orb]');
    if (!section || !stage || !visual) return;

    if (window.matchMedia('(max-width: 767px)').matches) return;

    /* One reusable tween per animated property. This handler runs on every
       pointer move — at 120Hz the old version constructed two tweens and ran
       two overwrite scans per event, roughly 240 of each per second. */
    const vRotY = gsap.quickTo(visual, 'rotationY', { duration: 0.6, ease: 'power2.out' });
    const vRotX = gsap.quickTo(visual, 'rotationX', { duration: 0.6, ease: 'power2.out' });
    const vX = gsap.quickTo(visual, 'x', { duration: 0.6, ease: 'power2.out' });
    const vY = gsap.quickTo(visual, 'y', { duration: 0.6, ease: 'power2.out' });

    const hasOrbs = orbs && orbs.length;
    /* Stagger is dropped: quickTo has no stagger, and a 40ms offset on a
       pointer-follow effect is imperceptible anyway. */
    const oX = hasOrbs ? gsap.quickTo(orbs, 'x', { duration: 0.75, ease: 'power2.out' }) : null;
    const oY = hasOrbs ? gsap.quickTo(orbs, 'y', { duration: 0.75, ease: 'power2.out' }) : null;

    const reset = () => {
      vRotY(0);
      vRotX(0);
      vX(0);
      vY(0);
      if (oX) { oX(0); oY(0); }
    };

    heroMouseHandler = (event) => {
      const rect = stage.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width - 0.5;
      const py = (event.clientY - rect.top) / rect.height - 0.5;

      vRotY(px * 18);
      vRotX(-py * 14);
      vX(px * 14);
      vY(py * 10);

      if (oX) {
        oX(px * -28);
        oY(py * -18);
      }
    };

    heroMouseHandler.leave = reset;
    section.addEventListener('mousemove', heroMouseHandler);
    section.addEventListener('mouseleave', reset);
  }

  function initHeroParallax() {
    const section = document.querySelector('[data-hero-section]');
    if (!section) return;

    const isMobile = window.matchMedia('(max-width: 767px)').matches;

    /* Vertical parallax only. This used to also scrub `rotationY` (2deg mobile,
       4deg desktop) — a 3D rotation applied to a border-radius:50% box holding
       an image, re-rasterised on every scroll frame. That is what made the
       circle flash while scrolling past it, and a 2deg tilt tied to scroll
       reads as nothing at all, so it is pure cost. */
    gsap.to(section.querySelector('[data-hero-visual]'), {
      y: isMobile ? -24 : -48,
      ease: 'none',
      scrollTrigger: { trigger: section, start: 'top top', end: 'bottom top', scrub: true },
    });

    gsap.to(section.querySelector('[data-hero-copy]'), {
      y: isMobile ? 12 : 24,
      ease: 'none',
      scrollTrigger: { trigger: section, start: 'top top', end: 'bottom top', scrub: true },
    });

    const bgLayer = section.querySelector('[data-hero-bg-layer]');
    if (bgLayer) {
      gsap.to(bgLayer, {
        y: isMobile ? -20 : -56,
        scale: 1.08,
        ease: 'none',
        scrollTrigger: { trigger: section, start: 'top top', end: 'bottom top', scrub: true },
      });
    }

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
        ease: 'power4.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          once: true,
        },
      });
    });
  }

  /* ─── Scroll reveals ───
     Stagger deliberately lives in exactly two places now: the hero entrance
     and the product grid. It previously appeared at 11 sites, so on the
     homepage alone the hero, the split titles, the glass story's intro and
     body, and the product grid all staggered — which stops reading as a
     deliberate choice and starts reading as a default. Split titles, the
     glass story and the origin story now animate as single units. */
  /* Scroll-driven animations run on the compositor, so where the browser
     supports them the reveal is handed to CSS and no ScrollTrigger is created
     at all — that is one fewer JS scroll subscriber per revealed element.
     The CSS keyframes only animate *towards* the element's default visible
     state, so an unresolved timeline can never leave content hidden. */
  const NATIVE_SCROLL_TIMELINE =
    typeof CSS !== 'undefined' &&
    typeof CSS.supports === 'function' &&
    CSS.supports('animation-timeline', 'view()');

  function initScrollReveals() {
    gsap.utils.toArray('[data-reveal]').forEach((el) => {
      if (el.closest('[data-hero-section]') || el.closest('[data-about-section]')) return;

      if (NATIVE_SCROLL_TIMELINE) {
        el.classList.add('reveal-native');
        return;
      }

      const y = parseFloat(el.dataset.revealY || 24);
      const scale = parseFloat(el.dataset.revealScale || 0.96);
      const delay = parseFloat(el.dataset.revealDelay || 0);
      /* Opt-in only (data-reveal-blur). Blur on every reveal would just be
         the next uniform effect applied to a dozen unrelated components. */
      const blur = el.hasAttribute('data-reveal-blur');

      gsap.from(el, {
        y,
        scale,
        autoAlpha: 0,
        filter: blur ? 'blur(6px)' : undefined,
        /* Was 1s with y:56 — a full second before copy the visitor is trying
           to read settles, applied identically to every [data-reveal] on the
           site. Shorter travel over a third of the time reads as polish
           rather than as waiting. */
        duration: 0.32,
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
              ease: 'power3.out',
              overwrite: true,
            });
          },
        });
      }
    });
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
    initBfcacheRestore();
    initHeroEntrance();
    initHero3DMouse();
    initHeroMagnetic();
    initHeroParallax();
    initSplitTitles();
    initScrollReveals();
    initAboutStory();
    initOriginStory();
    initProductCards();
    initProductGallery();
    initFooterReveal();
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
