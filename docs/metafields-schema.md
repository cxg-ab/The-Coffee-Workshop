# Product Metafields Schema

The theme reads a small, deliberate set of metafields. Admins control **what content to add** and **where it shows** (product page vs grid) per product — no code needed.

## Content fields (the info you fill in)

| Label | Namespace.key | Type | Used on |
|-------|---------------|------|---------|
| Origin / Region | `coffee.region` | Single line (choices) | PDP + grid |
| Process | `coffee.process` | Single line | PDP |
| Roast level | `coffee.roast_level` | Single line (choices: Light, Medium-Light, Medium, Dark) | PDP + grid |
| Tasting notes | `coffee.flavor_notes` | List of single line | PDP + grid |
| Altitude | `coffee.altitude` | Single line | PDP |
| Variety | `coffee.variety` | Single line | PDP |
| Brand | `custom.brand` | Single line | Barista Tools grid + PDP |
| Limited batch | `coffee.is_limited` | True / false | Badge |
| Details list | `custom.pdp_details` | Multi-line (one row per line, `Label: Value`) | PDP |
| How to use | `custom.how_to_use` | Rich text | PDP panel |
| Remark | `coffee.remark` | Multi-line | PDP |
| Category | `custom.categories` | List (choices) | Drives category pills + tool detection |

### Example values
**Process:** Washed, Natural, Honey, Anaerobic
**Roast level:** Light, Medium-Light, Medium, Dark
**Tasting notes:** add EACH note as its own entry (one chip per value).

## Display control (choose what shows — per product)

These two tick-lists let the admin curate each product. **Leave blank to use the category defaults** (existing products keep working untouched).

| Label | Namespace.key | Choices | Effect |
|-------|---------------|---------|--------|
| PDP fields to show | `custom.pdp_fields` | Origin, Process, Roast level, Tasting notes, Altitude, Variety, Brand, Details, How to use | Ticked = shows on the product page. Blank = show everything that has a value. Unticking hides a field even if filled. |
| Grid fields to show | `custom.grid_fields` | Origin, Brand, Tasting notes, Roast level | Ticked = shows under the card on grid pages (Name + Price always show). Blank = category default. |

### Grid defaults (when `grid_fields` is blank)
- **Barista Tools** (collection `accessories`, or Category = "Barista Tools") → **Name / Brand / Price**
- **All other collections** → **Name / Origin / Tasting notes / Price / Roast**

## Weight / size options (variants — not metafields)

Choosable options like **weight or size are standard Shopify variants, not metafields.**
Add them on the product page under **Variants → Add options like size** (e.g. an option
named `Weight` with values `150g`, `250g`, `1kg`).

- The PDP shows the option picker automatically whenever a product has a real admin
  option — the label is your option name (e.g. "Weight"), and each value is a pill.
- A product with a **single** value (e.g. only `150g`) shows one selected pill — it
  displays the option but there's nothing to choose until you add more values.
- Products with no option added just show price + Add to cart (no picker).

## Grid loading & filters

The collection grid loads the **whole collection in one page** (up to Shopify's 50-item
limit) so the on-page filters (Origin, Process, Tasting notes, Price) and the
"Showing X of Y" count are accurate across every product — not just the first page.
If the catalog ever grows past ~50 products, switch to Shopify's server-side storefront
filters rather than relying on this.

## Product URLs
Grid cards link with `product.url | within: collection`, producing collection-scoped URLs such as
`/collections/single-origin/products/bombe-basha-bekele`.
Shopify's canonical URL stays `/products/handle` (correct for SEO). Search / related links fall back to `/products/handle`.

## Retired
The Shopify **standard** metaobject metafields (`shopify.coffee-roast`, `shopify.flavor`, `shopify.material`, `shopify.dripper-design`, `shopify.caffeine-content`, etc.) are **not used by the theme** — the `coffee.*` / `custom.*` fields above are the source of truth. They can be deleted in Settings → Custom data → Products to reduce clutter.

## Shopify Admin path
**Settings → Custom data → Products → Add definition.** Enable **Storefront access** for every field the theme reads (the three new fields already have it).
