# YourStore — Cloudflare Pages Starter

A responsive storefront mockup with the requested front banner, product cards, search/categories, login/signup demo, and a local admin-panel preview.

## Deploy the static preview with GitHub + Cloudflare Pages

1. Extract this ZIP.
2. Create a GitHub repository (for example `yourstore`).
3. Upload **the contents of this folder** to the repository root. `index.html` should be at the root, not buried inside another folder.
4. Sign in at https://dash.cloudflare.com/
5. Go to **Workers & Pages → Create → Pages → Connect to Git** (wording may vary).
6. Select your GitHub repository.
7. For a plain static site, leave the build command empty and set the output directory to `/` or the repository root, as Cloudflare's current UI requests.
8. Deploy. Cloudflare will give you a `*.pages.dev` URL.

## Before using this for real customers

**This is a frontend starter/demo, not a production-ready e-commerce system.** It intentionally does not claim to securely handle real customer accounts, orders, or site-wide visitor analytics.

- The login/signup example stores demo data in the current browser's localStorage. It is **not secure authentication** and must not be used for real passwords.
- Admin changes and orders are only stored in the current browser. Other visitors will not see them.
- The visitor number is only a local browser counter, not accurate total visitors across all customers.
- To launch for real, add a server-side backend/database and secure admin authentication. Cloudflare Pages Functions + D1 or another backend can be used.
- WhatsApp order button: in `app.js`, set `const phone = "91XXXXXXXXXX";` to your business number (country code, digits only, no `+`). Do not publish until you replace it.
- Replace `YourStore` with your final store name and add your own product photos/prices/details.

## Marketplace branding note

The banner text requested for this mockup says “Connected by Meesho, Amazon, Flipkart & Many More!”. Only use wording or logos that do not falsely imply official partnership or integration. If there is no actual partnership, change it to neutral store branding before publishing.

## Files

- `index.html` — homepage, banner, login/signup dialog, admin panel markup
- `styles.css` — responsive dark navy/blue styling
- `app.js` — demo product listing and local interactions
