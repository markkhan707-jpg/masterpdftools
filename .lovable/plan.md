## Goal
Sync everything in the uploaded `pdftoolsmaster-main (3).zip` into this project, adding new features and overwriting existing files where they differ.

## What the zip adds (delta vs current project)
**New pages**
- `src/pages/AiChatPdf.tsx` (Chat-with-PDF)
- `src/pages/AiHumanizer.tsx` (AI text humanizer)
- `src/pages/AiMcqGenerator.tsx` (AI MCQ generator from PDFs)
- `src/pages/Auth.tsx` (login/signup)
- `src/pages/Compare.tsx` (PDF compare)

**New components**
- `DensityToggle.tsx`, `FavoriteButton.tsx`, `OfflineBanner.tsx`, `ScrollToTop.tsx`

**New edge functions**
- `supabase/functions/ai-chat-pdf`, `ai-humanize`, `ai-mcq`

**New public assets / configs**
- `public/ads.txt`, `public/llms.txt`, `public/logo.png`
- `vercel.json`, `.prettierrc`, `.prettierignore`

**Updated files** (overwritten with zip versions): `index.html`, `package.json`, `bun.lock`, `tailwind.config.ts`, `src/App.tsx`, `src/index.css`, `src/components/layout/*`, `src/pages/Index.tsx`, existing tool pages, `public/sitemap.xml`, `public/robots.txt`, etc.

## What will NOT be overwritten
- `.env` (current Lovable Cloud Supabase keys are kept — zip's `.env` ignored)
- `src/integrations/supabase/client.ts` and `types.ts` (auto-generated, kept)
- `supabase/config.toml` (kept)
- `.git` (zip has none; nothing to worry about)

## Steps
1. `rsync -a --exclude='.git' --exclude='.env' --exclude='src/integrations/supabase/client.ts' --exclude='src/integrations/supabase/types.ts' --exclude='supabase/config.toml' /tmp/zipcontent/pdftoolsmaster-main/ /dev-server/`
2. Run `bun install` to pick up any new deps from the updated `package.json` / `bun.lock`.
3. Verify build, fix any import/route mismatches if they surface.

## Notes
- Auth page implies user accounts — if the zip's Auth uses Supabase auth, I'll ensure email auth is enabled (no anonymous, no auto-confirm unless required).
- New edge functions will be auto-deployed.
- If anything in the zip conflicts with current Lovable Cloud project keys, current `.env` wins so the backend keeps working.
