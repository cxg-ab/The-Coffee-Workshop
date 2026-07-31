# 001 — Stop competing writers on the hero circle

- **Status**: TODO
- **Commit**: 18f64bd
- **Severity**: HIGH
- **Category**: Purpose & frequency / Performance / Interruptibility
- **Estimated scope**: 1–2 files (`theme/assets/animations.js`, optionally `theme/sections/hero.liquid` / CSS)

## Problem

Three systems write `transform` on the same `[data-hero-visual]` node on the homepage hero:

1. Entrance timeline — `scale` + `rotationY` (`initHeroEntrance`)
2. Pointer tilt — `rotationX` / `rotationY` / `x` / `y` via `gsap.quickTo` on every `mousemove` (`initHero3DMouse`)
3. Scroll parallax — `y` scrub (`initHeroParallax`)

They overwrite each other mid-frame. That is the feel-breaking “circle flash / shake on hover” regression. Pointer tilt also fails Emil’s purpose test for a surface returning visitors see often: it is decorative “looks alive” motion on a high-traffic viewport, not feedback or spatial story.

```js
/* theme/assets/animations.js:344-393 — current */
function initHero3DMouse() {
  // …
  const vRotY = gsap.quickTo(visual, 'rotationY', { duration: 0.6, ease: 'power2.out' });
  const vRotX = gsap.quickTo(visual, 'rotationX', { duration: 0.6, ease: 'power2.out' });
  const vX = gsap.quickTo(visual, 'x', { duration: 0.6, ease: 'power2.out' });
  const vY = gsap.quickTo(visual, 'y', { duration: 0.6, ease: 'power2.out' });
  // … section mousemove writes all four while parallax also writes y
}
```

```js
/* theme/assets/animations.js:407-411 — current */
gsap.to(section.querySelector('[data-hero-visual]'), {
  y: isMobile ? -24 : -48,
  ease: 'none',
  scrollTrigger: { trigger: section, start: 'top top', end: 'bottom top', scrub: true },
});
```

`.hero-visual` also keeps `will-change: transform` forever (`theme/assets/application.css:1279-1281`), which keeps the layer promoted even after motion should settle.

## Target

Prefer **delete** (Emil remedial hierarchy #1) for circle pointer transforms:

1. **Do not call `initHero3DMouse()`** from `initAnimations()` (or make the function an early `return`).
2. Keep **entrance** opacity/scale only — drop `rotationY` from the entrance `fromTo` on `visual` so nothing leaves a 3D rotation for later writers to fight.
3. Keep **parallax `y` only** on the circle (already done) OR move parallax to a parent wrapper that is not the same node entrance animates — if both stay on `visual`, after entrance completes call `gsap.set(visual, { clearProps: 'transform' })` then let only parallax own `y`, **or** parent the image and parallax the parent.
4. After entrance settles, add class `hero-visual--settled` and set `will-change: auto; pointer-events: none` on `.hero-visual` (pointer already has `pointer-events: none` on sweep; mirror for visual so hover cannot re-trigger anything).
5. Magnetic CTAs (`initHeroMagnetic`) may stay — they target `[data-magnetic]`, not the circle.

Exact entrance target for the circle:

```js
tl.fromTo(
  visual,
  { scale: 0.95, opacity: 0 },
  { scale: 1, opacity: 1, duration: 0.85, ease: 'power2.out', immediateRender: false },
  '-=0.65'
);
// onComplete of that tween (or timeline label):
visual.classList.add('hero-visual--settled');
gsap.set(visual, { clearProps: 'rotationX,rotationY' });
```

```css
/* application.css / hero styles */
.hero-visual.hero-visual--settled {
  will-change: auto;
  pointer-events: none;
}
```

## Repo conventions to follow

- Motion pack lives in `theme/assets/animations.js`; gate with `enabled()` / `prefers-reduced-motion` already at the top.
- Exemplar of settling intent: comments at `initHeroParallax` already document removing scrubbed `rotationY` for flash reasons — extend that decision to mouse tilt.
- Hero CTA press already uses `scale(0.97)` on `:active` in `theme/sections/hero.liquid:237` — keep press feedback there; do not move interaction onto the circle.

## Steps

1. In `initAnimations()`, remove or comment out `initHero3DMouse();` (leave the function stub returning immediately so nothing re-hooks it).
2. In `initHeroEntrance()`, change the visual `fromTo` to opacity + scale only (start `scale: 0.95`, not `0.88` + `rotationY: -10`). Duration `0.85`, ease `power2.out`.
3. On that tween’s `onComplete`, add `hero-visual--settled` and `clearProps` for rotation axes.
4. Add the `.hero-visual--settled` CSS rule (source CSS that compiles to `application.css`, or the section `<style>` if that is how hero overrides ship — match existing hero style placement in `hero.liquid` if edits there are preferred for unpublished theme push).
5. Confirm `initHeroParallax` still only animates `y` (no rotation). Do not reintroduce orb mouse offsets if orbs are absent from markup.

## Boundaries

- Do NOT change coffee-bean-roast scrub, Lenis, or origin-sticky choreography.
- Do NOT remove `initHeroMagnetic` unless CTAs misbehave.
- Do NOT add new animation libraries.
- If live theme still has `data-hero-orb` nodes, do not restart infinite orb float as part of this plan (see plan 004).

## Verification

- **Mechanical**: load homepage; in console, after load, `getComputedStyle(document.querySelector('[data-hero-visual]')).willChange` should be `auto` once settled; no `mousemove` listeners solely for tilt (DevTools Event Listeners on `[data-hero-section]`).
- **Feel check**: move the pointer across the circle for 5s — **no shake, flash, or tilt**. Scroll the hero out — circle may ease on `y` only, no flicker. Toggle `prefers-reduced-motion` — whole GSAP pack stays off via `enabled()`.
- **Done when**: hover no longer fights scroll/entrance; circle stays visually stable.
