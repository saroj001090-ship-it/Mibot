# DocuFlux PDF

DocuFlux PDF is a production-oriented, privacy-first Next.js PDF tools platform: **Edit, Compress, Convert, Sign, Scan**. All main tools are free forever with no pricing, subscriptions, locked exports, or forced signup.

## Highlights
- Next.js App Router + TypeScript + Tailwind CSS.
- Browser-first PDF engine abstraction using `pdf-lib` with interfaces for browser, server, WASM, and commercial SDK engines.
- SEO pages for every major PDF tool route.
- Premium upload UX with validation, local-first privacy notice, previews list, remove controls, and batch-ready structure.
- PWA manifest, robots, sitemap, OG asset, security headers, Prisma schema, admin/dashboard foundations.

## Development
```bash
npm install
npm run dev
npm run build
npm test
```

## Environment
Copy `.env.example` to `.env.local` and configure services only when enabling optional accounts, admin, analytics, cloud workers, Redis queues, or object storage.

## Deployment
- Frontend: Vercel or any Node-compatible host.
- Workers: Railway, Render, Fly.io, AWS, or VPS for OCR/Office/compression jobs.
- Data: PostgreSQL + Redis + S3-compatible temporary storage.
- Required policy: no document upload without explicit user consent; auto-delete temporary cloud files.

## Roadmap
1. Complete browser MVP operations and PDF viewer renderer.
2. Add OCR workers with English/Hindi models.
3. Add optional Auth.js account convenience.
4. Add BullMQ jobs and signed temporary downloads.
5. Expand blog and help SEO content.
