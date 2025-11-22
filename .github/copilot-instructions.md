# Copilot Instructions for AI Agents

## Purpose
This file gives concise, codebase-specific guidance so an AI coding agent can be productive immediately: architecture, key files, developer commands, integration points, and examples of common changes.

## Big Picture
- **Framework:** Next.js (app router) with TypeScript and Tailwind CSS. Main entry: `app/layout.tsx`, homepage `app/page.tsx`.
- **UI vs API:** UI lives in `components/` and `app/*` pages; server logic and HTTP endpoints are in `app/api/**/route.ts` (each folder under `app/api` represents an endpoint).
- **Shared logic:** `lib/` holds business services (pricing, products, order helpers). Shared types live in `types.ts`.
- **DB & Auth:** Prisma under `prisma/` and NextAuth with Prisma adapter (`lib/auth.ts`, `app/api/auth/[...nextauth]/route.ts`).

## Key Workflows & Scripts
- **Dev:** `npm run dev` (starts Next dev server).
- **Build:** `npm run build` (runs `prisma generate` first via `prebuild`).
- **DB migrations:** `npm run prisma:migrate` or `npm run prisma:push` for push.
- **Lint:** `npm run lint` (runs `eslint`).

Note: The `package.json` scripts include `prebuild` that executes `prisma generate` — keep Prisma models in sync before building.

## Project-Specific Conventions
- **App router + dynamic routes:** Product/category pages use nested dynamic routes (e.g. `app/[category]/[slug]/page.tsx`) and sometimes catch-all routes like `app/[product]/[...slug]/page.tsx`.
- **Client vs Server components:** Files that need client-side hooks include the `'use client'` directive at the top. If a component uses React state or browser-only APIs, mark it as client.
- **Config components:** Configurators are named like `*Configurator.tsx` inside `components/` (e.g. `AfiseConfigurator.tsx`, `BannerConfigurator.tsx`) and are wired from product pages.
- **State providers:** Cart and checkout state use React contexts in `components/CartContext.tsx`, `CartProvider.tsx`, and `CheckoutProvider.tsx` — update consumers when changing provider shapes.

## Integration Points & External Services
- **Stripe:** Client and server integration with files under `app/api/stripe/` and Stripe client libs in `package.json`.
- **File storage:** Uses S3 and Cloudinary helpers (`@aws-sdk/client-s3`, `cloudinary`) plus server upload route `app/api/upload/`.
- **Email / Magic links:** Uses NextAuth (email magic link) and `resend` package for transactional emails. See env vars in `README.md`.
- **Puppeteer:** Used for server-side PDF/preview generation (check usages in `lib/` or `scripts/`).

## Where to Make Common Changes (examples)
- Add product configurator: create `components/NewConfigurator.tsx` → add a route page `app/new-product/[slug]/page.tsx` → update `app/api/products/route.ts` or `lib/products.ts` for metadata.
- Change pricing logic: edit `app/api/calc-price/route.ts` and `lib/orderService.ts` (server-side). Ensure API requests remain spark-free and validated.
- Adjust authentication: edit `lib/auth.ts` for NextAuth config and `app/api/auth/[...nextauth]/route.ts` for routes.

## Environment & Security Notes
- Key env vars: `DATABASE_URL`, `NEXTAUTH_URL`, `AUTH_SECRET`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `OPENAI_API_KEY` (optional), `STRIPE_SECRET_KEY`, `RESEND_API_KEY`.
- Never commit `.env.local` or secrets. Follow existing patterns (they rely on `NEXTAUTH_URL` in production to avoid callback issues).

## Helpful Files to Inspect
- Routing/layout: `app/layout.tsx`, `app/page.tsx`, `app/globals.css`
- API examples: `app/api/calc-price/route.ts`, `app/api/products/route.ts`, `app/api/order/route.ts`
- Auth + DB: `lib/auth.ts`, `prisma/schema.prisma`, `components/Providers.tsx`
- Types & shared logic: `types.ts`, `lib/` folder

## Best Next Steps for the Agent
- When editing server code, run `npm run dev` locally to smoke test.
- Run `npm run prisma:generate` after changing Prisma schema, and `npm run prisma:migrate` if creating migrations.
- If unsure about where a feature lives, grep for the feature name across `app/`, `components/`, and `lib/`.

If anything above is unclear or you'd like me to expand a specific section (e.g., deployment, CI, or RAG integration), tell me which area and I'll iterate.
