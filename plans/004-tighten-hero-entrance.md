# 004 — Tighten homepage hero entrance (blur, duration, dead orb code)

- **Status**: TODO
- **Commit**: 18f64bd
- **Severity**: MEDIUM
- **Category**: Easing & duration / Performance / Cohesion
- **Estimated scope**: 1 file (`theme/assets/animations.js`), optional CSS for Arabic bg reduced-motion

## Problem

Homepage hero entrance is marketing-allowed to run longer, but several beats stack past Emil’s craft bar:

1. **Heading blur 12px** during word rise (`filter` animation) — expensive (esp. Safari); AUDIT.md: keep transition-time blur under **20px**, prefer less; often better to delete.
2. **Circle entrance 1.1s** + **orb entrance 1.2s** + infinite orb float — markup no longer ships `data-hero-orb` (hero.liquid has none), but dead code still prepares orb loops if nodes appear.
3. **Word stagger 0.07 × N + 0.9s** plus separate stagger items at 0.7s — fine for first visit, but combined with page-enter (plan 003) feels slow.
4. **Arabic background** `.hero-arabic-bg__word` runs infinite `floatArabicBg` with **no** `prefers-reduced-motion` kill in CSS (only Lenis height reset nearby). Reduced-motion users still get drifting type.

```js
/* theme/assets/animations.js:278-284 — current */
tl.fromTo(
  heading,
  { filter: 'blur(12px)' },
  { filter: 'blur(0px)', duration: 0.9, ease: 'power2.out' },
  0.35
);
```

```js
/* theme/assets/animations.js:244-247 — current */
{ scale: 0.88, opacity: 0, rotationY: -10 },
{ scale: 1, opacity: 1, rotationY: 0, duration: 1.1, ease: 'power2.out', … }
```

## Target

After plan 001’s circle values:

1. **Delete** the heading `filter: blur(…)` tween entirely (words already rise via `yPercent` masks — purpose covered).
2. Circle entrance: `scale 0.95 → 1`, `opacity 0 → 1`, **duration 0.85**, no `rotationY`.
3. Keep bronze sweep once (good rare delight) but cap at **duration 0.8** `power2.inOut`, fade out 0.3s.
4. Word mask tween: duration **0.75**, stagger **0.05** (still 30–80ms class).
5. Stagger secondary (`[data-hero-stagger]`): duration **0.55**, stagger **0.08**.
6. Remove or early-return the `orbs` entrance + infinite `gsap.to(orbs, { repeat: -1 })` block if `!orbs.length` (already gated) — delete the infinite float branch entirely to prevent regressions if orbs return without review.
7. CSS:

```css
@media (prefers-reduced-motion: reduce) {
  .hero-arabic-bg__word {
    animation: none !important;
  }
}
```

Easing stays **ease-out / power2.out / power3.out** (already correct — do not introduce `ease-in`).

## Repo conventions to follow

- Comments in `initScrollReveals` already argue against uniform stagger everywhere — apply the same restraint to hero secondary beats.
- Sweep comment says “Never loops (anti-slop)” — extend that ethic to orb float.

## Steps

1. Remove blur `fromTo` on `heading`.
2. Apply duration/stagger targets above; align circle with plan 001.
3. Delete infinite orb float block (keep a simple one-shot fade if orbs ever return — or delete orb handling completely).
4. Add reduced-motion kill for `.hero-arabic-bg__word`.
5. Feel-check with plan 001 settled class in place.

## Boundaries

- Do NOT touch coffee-bean-roast.
- Do NOT reintroduce Origins marquee.
- Do NOT add perpetual loops on the hero (sweep stays once).

## Verification

- **Feel check**: cold load homepage at 10% playback — heading stays sharp (no blur bloom); circle settles under ~1s wall-clock from first paint of visual; no continuous orb motion; with reduced-motion OS setting, Arabic words are static.
- **Performance**: Safari timeline — no long `filter` animations on the H1.
- **Done when**: entrance still feels premium once, but shorter and cheaper; reduced-motion respected for Arabic drift.
