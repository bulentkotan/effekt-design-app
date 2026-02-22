# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- **Dev server**: `npm run dev`
- **Build**: `npm run build`
- **Lint**: `npm run lint`
- **No test framework is configured.**

## Architecture

This is a Next.js 15 (App Router) + React 19 + TypeScript application for Effekt Design, a Dubai landscape design studio. Users walk through a multi-step wizard that collects property details, photos, and design preferences, then generates AI-powered landscape concepts with pricing.

### User Flow

1. **Homepage** (`app/page.tsx`) — landing with CTA
2. **Upload** (`app/design/upload/page.tsx`) — property info + photo/floor plan upload
3. **Questions** (`app/design/questions/[id]/page.tsx`) — 10 design preference questions (dynamic route, `lib/questions.ts` defines them)
4. **Generating** (`app/design/generating/page.tsx`) — loading screen while API works
5. **Results** (`app/design/results/[sessionId]/page.tsx`) — displays 3 concepts with images, plants, materials, and interactive quote builder

### Key Modules

- **`lib/claude.ts`** — Builds the prompt and calls the Anthropic Messages API (Claude Sonnet 4) directly via `fetch`. Parses the JSON response and hydrates `quoteLineItems` from the local pricing catalog.
- **`lib/imagegen.ts`** — Generates concept images via OpenAI Responses API (GPT-5.2 image generation tool). Saves base64 results as PNGs to `public/generated/`.
- **`lib/pricing.ts`** — Static pricing catalog (100+ line items across categories like demolition, flooring, planting, irrigation). Used both for prompt injection and quote hydration.
- **`lib/store.ts`** — Client-side session state via `localStorage`. All wizard progress is stored here; no server-side session.
- **`lib/supabase.ts`** — Supabase client for optional session persistence.
- **`types/index.ts`** — All shared TypeScript interfaces (`DesignConcept`, `QuoteLineItem`, `SessionData`, etc.).

### API Routes

- **`POST /api/generate`** — Orchestrates the full pipeline: Claude for text concepts → DALL-E for images. Has `maxDuration = 300` (5 minutes). Image generation failure is non-fatal.
- **`POST /api/session`** — Persists session to Supabase (optional, graceful fallback).

### Styling & UI

- Tailwind CSS v4 with custom theme defined in `app/globals.css` (brand colors: `brand-green #4A6741`, sage tones; fonts: Playfair Display serif, DM Sans sans-serif).
- Framer Motion for page transitions and micro-interactions (`components/ui/PageTransition.tsx`, `components/ui/Button.tsx`).
- Component organization: `components/layout/`, `components/questions/`, `components/results/`, `components/ui/`, `components/upload/`.

### Path Aliases

`@/*` maps to the project root (configured in `tsconfig.json`).

## Environment Variables

The app requires these in `.env.local`:

- `ANTHROPIC_API_KEY` — Claude API
- `OPENAI_API_KEY` — DALL-E image generation
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` — Supabase
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` — image hosting
- `NEXT_PUBLIC_BASE_URL` — app base URL
