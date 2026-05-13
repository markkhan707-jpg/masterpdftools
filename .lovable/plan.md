# Add AI-Powered PDF Tools

Add three new tools to the suite, all powered by Lovable AI (no API key needed from the user — runs through the existing Lovable Cloud backend).

## New Tools

### 1. AI PDF Summarizer (`/ai-summarize-pdf`)
- User uploads a PDF.
- Frontend extracts text in-browser with `pdfjs-dist` (already in project).
- Text is sent to an edge function `ai-summarize` which calls Lovable AI (`google/gemini-3-flash-preview`).
- Returns: TL;DR, 5–10 key bullet points, and a section-by-section summary, rendered as Markdown.
- "Copy" and "Download as .txt" buttons.

### 2. AI Translate PDF Text (`/ai-translate-pdf`)
- User uploads a PDF and picks a target language (dropdown: Spanish, French, German, Italian, Portuguese, Arabic, Hindi, Chinese, Japanese, Korean, + "Other" free text).
- Text extracted client-side, chunked (~6k chars), sent to edge function `ai-translate`.
- Streams translated text back into a textarea; can download as `.txt` or generate a translated PDF using `pdf-lib` (Helvetica, like the existing Text-to-PDF tool).

### 3. AI OCR for Scanned PDFs (`/ai-ocr-pdf`)
- User uploads a scanned/image PDF.
- Frontend rasterizes each page to a JPEG (via `pdfjs-dist`, already used in `InvertColors.tsx`).
- Each page image is sent to edge function `ai-ocr`, which forwards to Lovable AI's vision model (`google/gemini-2.5-flash`) with the image + instruction "Extract all text verbatim, preserve line breaks".
- Combined text returned per page, displayed with page markers, downloadable as `.txt`.

## Backend (Lovable Cloud Edge Functions)

Three new edge functions, all using `LOVABLE_API_KEY` (auto-provisioned, no user setup):

- `supabase/functions/ai-summarize/index.ts` — POST `{ text }` → returns `{ summary }`
- `supabase/functions/ai-translate/index.ts` — POST `{ text, targetLanguage }` → streams translated text (SSE)
- `supabase/functions/ai-ocr/index.ts` — POST `{ imageBase64 }` → returns `{ text }`

All include CORS headers, input validation, and surface 429 / 402 errors to the client as toasts.

No database tables, no auth required (tools stay anonymous like the rest of the suite).

## UI Integration

- Add the 3 routes in `src/App.tsx`.
- Add a new **"AI Tools"** category at the top of the categorized grid in `src/pages/Index.tsx` with sparkle/AI iconography (`Sparkles`, `Languages`, `ScanText` from lucide-react) and "NEW" badges.
- Add the 3 tools to the megamenu in `src/components/layout/Header.tsx`.
- Add them to `public/sitemap.xml`.
- Each page uses the existing `ToolPageShell` with rich SEO content + FAQ (matching the pattern already established across the 37 existing tools).

## Technical Notes

- Default model: `google/gemini-3-flash-preview` for text, `google/gemini-2.5-flash` for vision OCR (cheap + fast).
- Translator uses streaming SSE (per the AI Gateway streaming pattern) so long docs render progressively.
- OCR processes pages sequentially with a progress bar; cap at 20 pages with a clear message for larger files (cost/latency safety).
- All file processing (text extraction, rasterization) stays client-side; only extracted text/images go to the AI backend, preserving the project's privacy story (which gets called out on each tool page).
