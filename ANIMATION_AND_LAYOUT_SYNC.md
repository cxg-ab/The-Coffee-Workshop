# Animation & Layout Sync (Antigravity & Cursor)

**Status:** Homepage Animation Strategy Defined
**Date:** July 8, 2026
**Role:** Head of Website Animation & Dynamic Layout (Antigravity Agent)

Hello Cursor! Following our initial sync, I have brainstormed the ultimate animation logic and UI/UX strategy specifically for the **Homepage (`index.json` / sections)**. 

To achieve the "White & Gold Luxury" aesthetic, we must treat animations like a high-end editorial experience—fluid, purposeful, and never jarring. 

Here is the blueprint to implement:

## 1. The "Awakening" Hero Sequence (Initial Load)
**Logic:** Coffee represents clarity and morning rituals. The opening must feel like a luxurious reveal.
*   **Text Reveal:** Use GSAP to stagger-reveal the main headline. Apply `clip-path` masking so the text appears to rise out of thin air (`clip-path: inset(100% 0 0 0)` animating to `inset(0 0 0 0)`).
*   **Image Motion:** The main hero image (coffee beans/packaging) should fade in with a slow "Ken Burns" scale down (from `scale: 1.1` to `scale: 1.0` over 3-4 seconds) coupled with a subtle continuous vertical float (mimicking steam or weightlessness).
*   **Implementation:** `hero-3d.liquid` + Vanilla JS with GSAP.

## 2. The "Roast & Process" Parallax (Brand Story)
**Logic:** We want to immerse the user in the Ras Al Khaimah local roasting experience to justify the premium positioning.
*   **Scroll Depth:** Implement a Scroll-triggered parallax effect. The background imagery of the roastery should move slower than the scrolling foreground text.
*   **Staggered Fade:** As the user scrolls into the section, the title, paragraph, and CTA should fade in sequentially from the bottom (`translateY: 30px` to `0`).
*   **Implementation:** GSAP ScrollTrigger.

## 3. "Coffee Bean" Intent Hover (Featured Products)
**Logic:** Keep the initial grid minimal, but reveal rich flavor notes upon user intent (hover) without forcing a click to the PDP.
*   **The Card:** On hover, the main product image scales slightly (`scale 1.05` over `0.6s ease-out`).
*   **The Reveal:** A glassmorphism overlay (`backdrop-filter: blur(4px); background: rgba(255,255,255,0.6)`) slides up from the bottom of the card, revealing the **Flavor Notes** (e.g., Chocolate, Berry) and the **Quick Add** button.
*   **Implementation:** Tailwind `group-hover` classes in `product-card.liquid`. Keep it pure CSS for performance.

## 4. "Limited Batch" Magnetic Urgency
**Logic:** Limited products need to grab attention elegantly, not aggressively.
*   **The Badge:** The "Limited Batch" badge should have a subtle, continuous gold shimmer effect (CSS linear-gradient background animation).
*   **Interactive Button:** If possible, implement a "Magnetic Button" effect for the CTA in this section. When the mouse gets within a few pixels of the button, the button subtly translates toward the cursor. 
*   **Implementation:** Custom CSS keyframes for the shimmer; Vanilla JS mousemove listener for the magnetic button.

## 5. Subscription Toggle Morph
**Logic:** The transition between "Single Bean" and "Rotating Selection" must feel seamless to encourage sign-ups.
*   **The Switch:** When toggling the plan in the `subscription-cta.liquid` section, cross-fade the pricing and text smoothly (`opacity` transition). Do not let the layout jump.

### Critical Directives for Cursor:
1.  **Performance:** All GSAP and CSS animations MUST be wrapped in or check for `@media (prefers-reduced-motion: no-preference)`.
2.  **RTL Logic:** For any horizontal animations (like sliding in elements from the side), use CSS logical properties (`inset-inline-start`) or check the document direction in JS so it works flawlessly in both English and Arabic.
3.  **Dependencies:** Let's stick to **GSAP (ScrollTrigger)** for the complex scroll/hero animations, and **Tailwind/Vanilla CSS** for hovers and micro-interactions.

Please apply these concepts to the respective sections as you build them. 

---

## 6. Brainstormed New Features (Awaiting User Approval)
I have also proposed the following new feature concepts to the user to boost engagement on the Main Page and the Newsletter section. **Do not build these yet until we get approval:**

*   **Dynamic "Taste Profile" Quiz:** A small interactive block ("Find your perfect roast") that asks 2 quick questions (e.g., "How do you brew?", "Fruity or Chocolatey?") and dynamically recommends a specific bean with a quick add button.
*   **"Live Roasting" Status Ticker:** A marquee banner that injects urgency and highlights local RAK roasting (e.g., *"Currently roasting: Ethiopian Yirgacheffe — Ships tomorrow"*).
*   **"Unlock the Secret Stash" Newsletter Gate:** Instead of a generic "Subscribe for 10% off", the Newsletter section is framed as a "Secret Stash" club, offering subscribers early access to "Limited Batch" beans 48 hours before the public.
*   **Shoppable Reels Strip:** A horizontally scrolling strip of short, mute, auto-playing video clips (like Instagram Reels) showing the brewing process. Hovering reveals the specific gear/beans used with a "Quick Add" button.

I will review the visual output once staged!
