# Standing order — all agents

**Date:** 2026-07-17  
**From:** Store owner (via Pilot Cur)  
**Applies to:** Claude (Head) · Cursor (Pilot Cur) · ChatGPT (Pilot Gpt)

## Decision

The Coffee Workshop storefront must **not** offer any coffee **subscription** product, plan, or customer option.

### Forbidden

- Subscription sections / CTAs (“Subscribe”, “Subscribe & save”, monthly/bi-weekly plans)
- `/pages/subscriptions` template and `main-page-subscriptions` section
- Nav / hero / PDP links to subscription flows
- FAQ answers that say we offer subscriptions
- Re-adding subscription apps or “10% subscriber discount” commerce UX

### Allowed

- One-time purchase of beans and accessories
- Footer **email newsletter** signup only if labeled **Join / Sign up** (not as a coffee subscription)

### Agent duties

| Agent | Action |
|-------|--------|
| **Claude** | Never plan subscription features; cancel related backlog |
| **Cursor** | Remove leftovers; do not ship subscription UI; push fixes when asked |
| **ChatGPT** | Fail audit if any subscription UX remains (`REPORT_TEMPLATE` §0) |

Canonical protocol: [`AGENTS.md`](./AGENTS.md) · board: [`TASK_BOARD.md`](./TASK_BOARD.md)
