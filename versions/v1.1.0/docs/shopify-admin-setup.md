# Shopify Admin Setup — The Coffee Workshop

Complete these steps in your Shopify Admin to connect the theme to your store.

---

## 1. Upload the theme

**Option A — Shopify CLI (recommended)**

```bash
npm install
npm run build
shopify theme dev --path theme
```

**Option B — Manual zip upload**

1. Run `npm run build` locally.
2. Zip the **contents** of the `theme/` folder.
3. Admin → **Online Store → Themes → Add theme → Upload zip**.

---

## 2. Brand settings

1. **Online Store → Themes → Customize**
2. **Theme settings → Brand**
   - Upload logo (`assets/brand/logo-primary.png` from this repo)
   - Set logo width (~180px)
   - Upload favicon (square crop of logo if needed)

---

## 3. Languages (English + Arabic)

1. **Settings → Languages**
2. Add **Arabic**
3. Publish both English and Arabic
4. The theme locale switcher appears automatically when multiple languages are active

---

## 4. Navigation menus

Create these menus under **Online Store → Navigation**:

### Main menu (`main-menu`)
- Shop Beans → `/collections/beans`
- Accessories → `/collections/accessories`
- Subscriptions → `/pages/subscriptions`
- About → `/pages/about`
- FAQ → `/pages/faq`

Assign in **Customize → Header → Main menu**.

### Footer menus
- **Shop:** Beans, Accessories, Subscriptions
- **Support:** FAQ, Contact
- **Legal:** Privacy, Refund, Shipping, Terms policies

---

## 5. Collections

Create:

| Collection | Handle | Notes |
|------------|--------|-------|
| Beans | `beans` | 20 products at launch |
| Accessories | `accessories` | 10 products at launch |

---

## 6. Product metafields (beans)

**Settings → Custom data → Products → Add definition**

| Name | Namespace & key | Type |
|------|-----------------|------|
| Process | `coffee.process` | Single line text |
| Roast level | `coffee.roast_level` | Single line text |
| Flavor notes | `coffee.flavor_notes` | List of single line text |
| Limited batch | `coffee.is_limited` | True or false |

See `docs/metafields-schema.md` for full schema.

---

## 7. Search & Discovery filters

1. Install **Shopify Search & Discovery** (free)
2. **Filters** → Add filters for:
   - `coffee.process`
   - `coffee.roast_level`
   - `coffee.flavor_notes`

---

## 8. Payments

**Settings → Payments**

1. Enable **Shopify Payments** (required for Apple Pay / Google Pay in UAE)
2. Enable **Apple Pay** and **Google Pay** in wallet settings
3. Enable **Cash on Delivery (COD)** for UAE

> Note: COD may not be available for subscription orders — test both flows.

---

## 9. Shipping

**Settings → Shipping and delivery**

1. Create zone: **United Arab Emirates**
2. Add shipping rates
3. Create free shipping rate: **Orders over AED 300**

---

## 10. Subscriptions (Basic plan)

On Basic, use a compatible app:

1. Visit **Shopify App Store** → search **Seal Subscriptions** or **Shopify Subscriptions**
2. Create selling plans:
   - Single bean — monthly
   - Single bean — bi-weekly
   - Rotating selection — monthly
   - Rotating selection — bi-weekly
3. Set **10% subscriber discount** on each plan

---

## 11. Shopify Email

**Marketing → Shopify Email**

Enable:
- Welcome email
- Abandoned checkout recovery

---

## 12. Pages to create

Create these under **Online Store → Pages** (content can be added later):

- About (`about`)
- FAQ (`faq`)
- Subscriptions (`subscriptions`)
- Privacy policy (use Shopify template)
- Refund policy
- Shipping policy
- Terms of service

---

## 13. Domain

**Settings → Domains** — connect your custom domain when ready.

---

## Need help?

Share your store URL (`your-store.myshopify.com`) so the dev theme can be linked via Shopify CLI.
