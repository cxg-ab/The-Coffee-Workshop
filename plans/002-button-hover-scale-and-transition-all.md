# 002 — Gate or delete button hover scale; kill `transition: all`

- **Status**: DONE
- **Commit**: 18f64bd
- **Severity**: HIGH
- **Category**: Purpose & frequency / Accessibility / Performance
- **Estimated scope**: 2 files (`theme/assets/animations.js`, button CSS in `theme/assets/application.css` source)

## Problem

Homepage (and global) primary/outline buttons get a JS hover scale on every `mouseenter` / `mouseleave`, with **no** fine-pointer / hover-media gate. Touch devices can false-fire hover. Frequency is tens/day for CTAs — Emil: reduce or delete.

```js
/* theme/assets/animations.js:780-788 — current */
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
```

CSS compounds the problem with unbounded transitions:

```css
/* theme/assets/application.css:605-623 — current (compiled) */
.btn-primary {
  transition-property: all;
  transition-duration: 300ms;
  transition-timing-function: cubic-bezier(0.22, 1, 0.36, 1);
}
```

Same pattern on `.btn-outline` (`transition-property: all`). Brand-story value cards on the homepage also use `transition: all 0.3s …` (`.about-value-card`).

Hero primary CTA already has correct press feedback (`:active { transform: scale(0.97) }` in `hero.liquid`) — global buttons should match that pattern, not a hover grow.

## Target

**Prefer delete** of `initButtonMotion` hover scale entirely.

Replace with CSS:

```css
.btn-primary,
.btn-outline {
  transition-property: background-color, color, border-color, box-shadow, transform;
  transition-duration: 160ms;
  transition-timing-function: cubic-bezier(0.23, 1, 0.32, 1); /* --ease-out */
}

.btn-primary:active,
.btn-outline:active {
  transform: scale(0.97);
}

@media (hover: hover) and (pointer: fine) {
  /* optional: color/shadow only — NO scale on hover */
  .btn-primary:hover { background-color: var(--color-brand-dark); }
}

@media (prefers-reduced-motion: reduce) {
  .btn-primary,
  .btn-outline {
    transition-property: background-color, color, border-color;
  }
  .btn-primary:active,
  .btn-outline:active {
    transform: none;
  }
}
```

For `.about-value-card` on homepage brand-story:

```css
.about-value-card {
  transition: transform 200ms cubic-bezier(0.23, 1, 0.32, 1),
    box-shadow 200ms cubic-bezier(0.23, 1, 0.32, 1),
    background-color 200ms ease;
  /* not: transition: all … */
}
```

If hover lift on cards is kept, gate it:

```css
@media (hover: hover) and (pointer: fine) {
  .about-value-card:hover { transform: translateY(-2px); } /* subtle */
}
```

Remove `initButtonMotion()` call from `initAnimations()`.

## Repo conventions to follow

- Strong ease-out token to introduce if missing: `--ease-out: cubic-bezier(0.23, 1, 0.32, 1);` beside other CSS variables in `theme/snippets/css-variables.liquid` (or existing tokens file).
- Exemplar: `theme/sections/hero.liquid:237` — `:active { transform: scale(0.97); }` with property-specific transitions on `.hero-cta`.
- Magnetic buttons already bail on `(pointer: coarse)` — any remaining pointer motion must do the same or use the CSS hover media query.

## Steps

1. Delete or no-op `initButtonMotion` and remove it from `initAnimations()`.
2. Edit the Tailwind/source stylesheet that emits `.btn-primary` / `.btn-outline` so `transition-property` is explicit (not `all`); duration **160ms** for transform; keep color transitions.
3. Add `:active { transform: scale(0.97) }` for both button classes.
4. Replace `.about-value-card { transition: all … }` with explicit properties; optionally gate hover translate.
5. Ensure reduced-motion drops transform transitions.

## Boundaries

- Do NOT restyle button colors/branding beyond transition properties.
- Do NOT add Framer Motion or new deps.
- Do NOT animate shop category pills / header chrome (high frequency — out of scope).

## Verification

- **Mechanical**: grep `initButtonMotion` — no call sites; grep `transition-property: all` / `transition: all` on `.btn-primary` and `.about-value-card` — gone.
- **Feel check**: press a Visit CTA / primary button — quick press squash (~160ms), no hover grow. On a phone emulator, tap does not leave a stuck “hovered” scale. Animations panel at 10%: press feels snappy (ease-out), not slow to start.
- **Done when**: no JS hover scale; no `transition: all` on those homepage controls; `:active` feedback present.
