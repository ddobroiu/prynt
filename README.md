This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## AI Assistant (MVP)

We ship a minimal on-site assistant to recommend the right print service based on a short free-text query in Romanian.

- UI: `components/AssistantWidget.tsx` (floating chat bubble)
- API: `app/api/assistant/route.ts` (keyword-based intent mapping -> configurator links)

It works out of the box without external services. Users can type e.g. “banner exterior 300×100 cm cu capse” and receive links to the relevant configurators. Delivery ETA shown: 24–48h total.

### Upgrade to GPT with RAG (optional)

1) Provision an LLM (OpenAI or Azure OpenAI) and set credentials as environment variables:

```
# .env.local
OPENAI_API_KEY=...
OPENAI_BASE_URL= # optional (Azure OpenAI)
OPENAI_MODEL=gpt-4o-mini
```

2) Replace the rule-based logic in `app/api/assistant/route.ts` with a call to your LLM and add retrieval over your data (e.g. `lib/products.ts`, `lib/landingData.ts`, `lib/blogPosts.ts`). Index content into embeddings at build-time or on first request, and ground answers with citations + internal links. You can also add tool-calls to:

- `app/api/calc-price/route.ts` for instant pricing
- `app/api/products/route.ts` for product metadata
- `app/api/order/create` to draft carts/orders

This keeps responses accurate and actionable while preserving your existing pricing and checkout flows.
