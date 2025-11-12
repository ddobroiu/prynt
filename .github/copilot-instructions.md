# Copilot Instructions for AI Agents

## Project Overview
- This is a Next.js app using the `/app` directory structure, TypeScript, and Tailwind CSS.
- Major features are organized by product/category in `app/[category]/[slug]/page.tsx` and similar nested routes.
- API routes are in `app/api/`, e.g. `app/api/calc-price/route.ts` for price calculation, `app/api/order/` for order creation, and `app/api/products/route.ts` for product data.
- UI components are in `components/`, named by product or function (e.g. `AfiseConfigurator.tsx`, `CartWidget.tsx`).
- Shared logic/services are in `lib/` (e.g. `orderService.ts`, `products.ts`).

## Key Workflows
- **Start dev server:** `npm run dev` (or `yarn dev`, etc.)
- **Edit main page:** `app/page.tsx` (auto-reloads)
- **Add product/category page:** Create/modify files in `app/[category]/[slug]/page.tsx`.
- **API endpoints:** Add/modify files in `app/api/`.
- **Global styles:** Edit `app/globals.css`.
- **Type definitions:** Use `types.ts` for shared types.

## Patterns & Conventions
- **Routing:** Uses Next.js app router, dynamic segments in square brackets (e.g. `[category]`, `[slug]`).
- **Component naming:** Configurators and widgets are named by product/function (e.g. `BannerConfigurator`, `CartProvider`).
- **State management:** Cart and checkout use React context providers (`CartProvider.tsx`, `CheckoutProvider.tsx`).
- **Data flow:** API routes handle backend logic; UI components fetch via Next.js server/client functions.
- **Styling:** Tailwind CSS is used throughout; config in `tailwind.config.ts`.
- **Font:** Uses `next/font` for optimized font loading.

## Integration Points
- **Stripe:** Payment logic in `app/api/stripe/`.
- **File uploads:** Handled in `app/api/upload/`.
- **SEO:** Robots/sitemap in `app/robots.txt/route.ts` and `app/sitemap.xml/route.ts`.

## Examples
- To add a new product configurator: create a component in `components/`, add a route in `app/[product]/[...slug]/page.tsx`, and update API logic in `app/api/products/route.ts` if needed.
- To update cart logic: edit `components/CartContext.tsx` and `components/CartProvider.tsx`.

## References
- See `README.md` for basic setup and Next.js links.
- See `types.ts` for shared type definitions.
- See `lib/` for business logic/services.

---
For questions or unclear patterns, ask for feedback or clarification from maintainers.
