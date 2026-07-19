# Product Metafields Schema

## Beans

| Label | Namespace.key | Type | Filter | PDP |
|-------|---------------|------|--------|-----|
| Process | `coffee.process` | Single line text | Yes | Yes |
| Roast level | `coffee.roast_level` | Single line text | Yes | Yes |
| Flavor notes | `coffee.flavor_notes` | List of single line text | Yes | Yes |
| Origin | `coffee.origin` | Single line text | No | Yes |
| Altitude | `coffee.altitude` | Single line text | No | Optional |
| Varietal | `coffee.varietal` | Single line text | No | Optional |
| Limited batch | `coffee.is_limited` | True or false | No | Badge |
| Roast date | `coffee.roast_date` | Date | No | Optional |

### Example values

**Process:** Washed, Natural, Honey, Anaerobic  
**Roast level:** Light, Medium, Medium-Dark, Dark  
**Flavor notes:** Chocolate, Berry, Floral, Citrus, Caramel, Nutty

---

## Accessories

| Label | Namespace.key | Type |
|-------|---------------|------|
| Type | `accessory.type` | Single line text |
| Material | `accessory.material` | Single line text |
| Compatibility | `accessory.compatibility` | Single line text |

---

## Shopify Admin path

**Settings → Custom data → Products → Add definition**

Enable **Storefront access** for each metafield used in the theme.
