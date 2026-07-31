# 003 — Skip `#main-content` page-enter when the homepage hero is present

- **Status**: TODO
- **Commit**: 18f64bd
- **Severity**: MEDIUM
- **Category**: Purpose & frequency / Cohesion
- **Estimated scope**: 1 file (`theme/assets/animations.js`)

## Problem

Every page runs a global enter on `#main-content` (0.65s, `y: 16`, fade). On the homepage the hero **also** runs a long entrance timeline (eyebrow, words, circle, stagger, sweep). Visitors get a double curtain: whole main shifts up while the hero choreographs itself. That delays first content and fights the hero’s own `visibility` / stagger logic.

```js
/* theme/assets/animations.js:171-181 — current */
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
```

Frequency: every homepage load. Purpose of page-enter is “prevent jarring change” — but the hero already owns that job on index.

## Target

```js
function initPageEnter() {
  const main = document.querySelector('#main-content');
  if (!main) return;

  /* Homepage hero owns first paint — do not double-animate the whole main. */
  if (document.querySelector('[data-hero-section]')) return;

  gsap.from(main, {
    autoAlpha: 0,
    y: 12,
    duration: 0.45,
    ease: 'power3.out',
    delay: 0.05,
  });
}
```

If you keep page-enter on non-hero templates, cap duration at **≤450ms** and travel at **≤12px** (still under marketing budgets; closer to UI restraint).

## Repo conventions to follow

- `enabled()` already respects `prefers-reduced-motion` and `data-animations`.
- Hero copy flash prevention comments in `initHeroEntrance` assume hero children control visibility — page-enter on `#main-content` works against that.

## Steps

1. Add the early return when `[data-hero-section]` exists.
2. Optionally shorten the remaining non-hero page-enter as above.
3. Leave `initBfcacheRestore` as-is (still clears props if a tween ran).

## Boundaries

- Do NOT remove hero entrance.
- Do NOT change route transition libraries (none beyond this tween).

## Verification

- **Feel check**: hard-reload homepage — main content is not faded/shifted as a block; only hero timeline plays. Open Cart or About (no hero) — soft enter still OK if desired.
- **Done when**: homepage first paint is not double-animated.
