# HealthyNewLifestyle

Responsive Next.js storefront for HealthyNewLifestyle by OrganicandNutrition.
The site includes the public page structure, all 21 category routes, search,
customer support pages, policy routes, and browser-local cart and wishlist
state.

## Development

- Node.js 20.9 or later
- npm
- Docker (optional)

```bash
npm ci
npm run dev
```

Open [http://localhost:3001](http://localhost:3001).

```bash
npm run lint
npx tsc --noEmit
npm run build
```

The Next.js scripts use Webpack because the current Windows environment blocks
Next.js's native Turbopack binding.

## Routes

- `/` — Home
- `/about` — About HealthyNewLifestyle
- `/shop` — Category directory
- `/categories/[slug]` — Category pages for the 21 supplied categories
- `/products/[slug]` — Product information page
- `/search?q=...` — Category search
- `/contact` — Verified company contact information
- `/sourcing` — Sourcing enquiries
- `/login`, `/account` — Customer account support
- `/account/orders`, `/account/orders/[id]` — Order information
- `/cart`, `/wishlist`, `/checkout` — Shopping routes
- `/policies/privacy`, `/policies/terms`, `/policies/shipping`, `/policies/returns` — Policy routes
- `/admin` — Separate administration route
- Custom not-found page

## Content and shopping state

The supplied category names are in `src/features/catalog/catalog-data.ts`.
The category photographs under `public/images` are editorial imagery, not
product photographs or representations of company packaging.

No approved product catalogue, prices, variants, stock, product photography,
customer reviews, certifications, company history, sourcing details, offers,
social accounts, or policy copy are present. Product cards, purchasing totals,
and online checkout therefore remain unavailable rather than displaying
unverified information.

Cart and wishlist state is stored in browser `localStorage` using the existing
`hnl-demo-cart` and `hnl-demo-wishlist` keys so previously saved state is not
discarded. If stored entries do not have corresponding product details, they
remain removable but cannot be priced or checked out.

The only confirmed company details are OrganicandNutrition, Building No. 24,
Ashok Biller, Vellore, and 6381243416. There is no backend, database,
authentication, payment processing, or RustFS connection.

## Source structure

```text
src/
  app/
    (storefront)/           Public pages and storefront layout
    admin/                  Separate administration layout
  components/
    admin/                  Admin shell
    storefront/             Shared header, footer, and information layout
    ui/                     Reusable presentation components
  features/
    cart/                   Local cart and wishlist state
    catalog/                Category data and listing pages
    customers/              Customer-facing features
    homepage/               Homepage and hero carousel
  config/                   Central configuration scaffold
```

## Docker

The existing standalone-output Docker configuration is retained. Build and run
from the `frontend` directory:

```bash
docker build -t healthy-new-lifestyle-frontend .
docker run --rm -p 3000:3000 healthy-new-lifestyle-frontend
```
