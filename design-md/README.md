# DESIGN.md library (VoltAgent/awesome-design-md)

Pulled from [VoltAgent/awesome-design-md](https://github.com/VoltAgent/awesome-design-md) (MIT).

These are **not** Cursor `SKILL.md` packages — they are Google Stitch–style **DESIGN.md** brand analyses. Drop one into the project root as `DESIGN.md` so coding agents match that visual language.

## Activate a brand

```bash
# Example: Starbucks (warm retail coffee)
cp design-md/starbucks/DESIGN.md ./DESIGN.md

# Example: Apple (restraint / product-led)
cp design-md/apple/DESIGN.md ./DESIGN.md

# Example: Shopify (commerce)
cp design-md/shopify/DESIGN.md ./DESIGN.md
```

Then ask the agent: “build / redesign this page using DESIGN.md”.

## TCW note

The Coffee Workshop already has its own brand (bronze, `#FAFAF8`, luxury). Prefer a **TCW-specific** `DESIGN.md` (or use these as reference only) rather than replacing the storefront with another brand’s tokens wholesale.

## Update

```bash
git clone --depth 1 https://github.com/VoltAgent/awesome-design-md.git /tmp/awesome-design-md
rm -rf design-md
mkdir design-md
cp -a /tmp/awesome-design-md/design-md/. design-md/
# restore this README if overwritten
```
